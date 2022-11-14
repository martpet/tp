import type { NumberTag, StringArrayTag } from 'exifreader';

import { FileMeta } from '~/features/upload/types';

export async function getExifData(file: File): Promise<FileMeta['exif']> {
  const { default: ExifReader } = await import('exifreader');
  const tags = await ExifReader.load(file, { expanded: true });
  const { gps, exif } = tags;

  return {
    dateTimeOriginal: isoDate(exif?.DateTimeOriginal, exif?.OffsetTimeOriginal),
    gpsAltitude: number(gps?.Altitude, 0),
    gpsLatitude: number(gps?.Latitude, 6),
    gpsLongitude: number(gps?.Longitude, 6),
    gpsDestBearing: number(exif?.GPSDestBearing?.description, 0),
    gpsHPositioningError: number(exif?.GPSHPositioningError?.description, 0),
    gpsSpeed: length(exif?.GPSSpeed, exif?.GPSSpeedRef, 0),
    make: exif?.Make?.description,
    model: exif?.Model?.description,
    lensModel: exif?.LensModel?.description,
  };
}

function number(input: string | number | undefined, digits?: number) {
  let result = Number(input);
  if (Number.isNaN(result)) return undefined;
  if (typeof digits !== undefined) {
    result = Number(result.toFixed(digits));
  }
  return result;
}

function length(
  lengthTag: NumberTag | undefined,
  unitTag?: StringArrayTag | undefined,
  digits?: number
) {
  const result = number(lengthTag?.description, digits);

  if (unitTag && typeof result === 'number') {
    switch (unitTag.value[0]) {
      case 'M':
        return milesToKm(result);
      case 'N':
        return knotsToKm(result);
      default:
        return result;
    }
  }
  return result;
}

function isoDate(
  dateTag: StringArrayTag | undefined,
  offsetTag: StringArrayTag | undefined
) {
  if (!dateTag || !offsetTag) {
    return undefined;
  }
  const [date, time] = dateTag.value[0].split(' ');
  const zone = offsetTag.value[0];
  return `${date.replaceAll(':', '-')}T${time}Z${zone}`;
}

function milesToKm(miles: number) {
  return miles * 0.621371;
}

function knotsToKm(knots: number) {
  return knots * 1.852;
}
