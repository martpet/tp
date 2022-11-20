import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { PostGenerateUploadUrlsResponse } from '~/common/types';
import { UploadableFile } from '~/features/upload/types';

export const uploadApi = api.injectEndpoints({
  endpoints: (build) => ({
    generateUploadUrls: build.mutation<PostGenerateUploadUrlsResponse, UploadableFile[]>({
      query: (files) => ({
        url: apiPaths['generate-upload-urls'],
        method: 'POST',
        body: files.map(({ exif: { dateTimeOriginal, gpsLatitude, gpsLongitude } }) => ({
          dateTimeOriginal,
          gpsLatitude,
          gpsLongitude,
        })),
      }),
    }),
  }),
});
