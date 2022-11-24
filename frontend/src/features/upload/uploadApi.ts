import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { PostGenerateUploadUrlsResponse } from '~/common/types';
import { FileMeta } from '~/features/upload/types';

export const uploadApi = api.injectEndpoints({
  endpoints: (build) => ({
    generateUploadUrls: build.mutation<PostGenerateUploadUrlsResponse, FileMeta[]>({
      query: (files) => ({
        url: apiPaths['generate-upload-urls'],
        method: 'POST',
        body: files.map(({ id, hash }) => ({ id, hash })),
      }),
    }),
  }),
});
