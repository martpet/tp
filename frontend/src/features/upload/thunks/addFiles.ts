import { createAsyncThunk } from '@reduxjs/toolkit';
import type { NumberArrayTag, NumberTag, StringArrayTag, Tags } from 'exifreader';

import { RootState } from '~/common/types';
import { FileMeta } from '~/features/upload/types';

const { default: ExifReader } = await import('exifreader');

export const addFiles = createAsyncThunk(
  'upload/addFilesStatus',
  async (fileList: FileList, thunkAPI) => {
    const filesMeta: FileMeta[] = [];
    const state = thunkAPI.getState() as RootState;
    const currentFilesKeys = state.upload.filesMeta.map((file) => file.key);
    const duplicateFilesKeys: string[] = [];

    await Promise.all(
      Array.from(fileList).map(async (file) => {
        const { name, size } = file;
        const key = `${name}-${size}`;

        if (currentFilesKeys.includes(key)) {
          duplicateFilesKeys.push(key);
          return;
        }

        filesMeta.push({
          key,
          name,
          objectURL: URL.createObjectURL(file),
          exif: await getExifData(file),
        });
      })
    );

    return {
      filesMeta,
      duplicateFilesKeys,
    };
  }
);

async function getExifData(file: File): Promise<FileMeta['exif']> {
  const tags = await ExifReader.load(file, { expanded: true });
  const { gps } = tags;

  // https://github.com/mattiasw/ExifReader/pull/210
  const exif = tags.exif as Tags & {
    OffsetTimeOriginal: StringArrayTag;
    GPSHPositioningError: NumberArrayTag;
  };

  return {
    dateTimeOriginal: isoDate(exif?.DateTimeOriginal, exif?.OffsetTimeOriginal),
    gpsAltitude: number(gps?.Altitude, 0),
    gpsLatitude: number(gps?.Latitude, 6),
    gpsLongitude: number(gps?.Longitude, 6),
    gpsDestBearing: number(exif?.GPSDestBearing?.description, 0),
    gpsHPositioningError: number(exif?.GPSHPositioningError?.description, 0),
    gpsSpeed: length(exif?.GPSSpeed, 0, exif?.GPSSpeedRef),
    make: exif?.Make?.description,
    model: exif?.Model?.description,
    lensModel: exif?.LensModel?.description,
  };
}

function number(input: string | number | undefined, digits?: number) {
  let result = Number(input);
  if (typeof digits !== undefined) {
    result = Number(result.toFixed(digits));
  }
  if (Number.isNaN(result)) return undefined;
  return result;
}

function length(
  lengthTag: NumberTag | undefined,
  digits?: number,
  unitTag?: StringArrayTag | undefined
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
  utcOffsetTag?: StringArrayTag | undefined
) {
  if (!dateTag) return undefined;
  const [date, time] = dateTag.value[0].split(' ');
  const [utcOffset] = utcOffsetTag?.value || [''];
  return `${date.replaceAll(':', '-')}T${time}${utcOffset}`;
}

function milesToKm(miles: number) {
  return miles * 0.621371;
}

function knotsToKm(knots: number) {
  return knots * 1.852;
}
