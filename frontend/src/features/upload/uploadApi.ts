import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { PostUploadUrlsRequest, PostUploadUrlsResponse } from '~/common/types';

const uploadApi = api.injectEndpoints({
  endpoints: (build) => ({
    createUploadUrls: build.mutation<PostUploadUrlsResponse, PostUploadUrlsRequest>({
      query: (body) => ({
        url: apiPaths['upload-urls'],
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { createUploadUrls } = uploadApi.endpoints;
