import type { NumberTag, StringArrayTag } from 'exifreader';

import { toFixedGeoNumber, toFixedNumber } from '~/common/utils';
import { FileMeta } from '~/features/upload';

export async function getExif(file: File): Promise<FileMeta['exif']> {
  const { default: ExifReader } = await import('exifreader');
  const tags = await ExifReader.load(file, { expanded: true });
  const { gps, exif } = tags;

  return {
    dateTimeOriginal: dateTimeISO(exif?.DateTimeOriginal, exif?.OffsetTimeOriginal),
    gpsAltitude: toFixedGeoNumber('altitude', gps?.Altitude),
    gpsLatitude: toFixedGeoNumber('latitude', gps?.Latitude),
    gpsLongitude: toFixedGeoNumber('longitude', gps?.Longitude),
    gpsDestBearing: toFixedGeoNumber('bearing', exif?.GPSDestBearing?.description),
    gpsHPositioningError: toFixedNumber(exif?.GPSHPositioningError?.description, 0),
    gpsSpeed: length(exif?.GPSSpeed, exif?.GPSSpeedRef, 0),
    make: exif?.Make?.description,
    model: exif?.Model?.description,
    lensModel: exif?.LensModel?.description,
  };
}

function length(
  lengthTag: NumberTag | undefined,
  unitTag?: StringArrayTag | undefined,
  digits?: number
) {
  const result = toFixedNumber(lengthTag?.description, digits);

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

function dateTimeISO(
  dateTag: StringArrayTag | undefined,
  offsetTag: StringArrayTag | undefined
) {
  if (!dateTag || !offsetTag) {
    return undefined;
  }
  const [date, time] = dateTag.value[0].split(' ');
  const utcOffset = offsetTag.value[0];
  return `${date.replaceAll(':', '-')}T${time}${utcOffset}`;
}

function milesToKm(miles: number) {
  return miles * 0.621371;
}

function knotsToKm(knots: number) {
  return knots * 1.852;
}
