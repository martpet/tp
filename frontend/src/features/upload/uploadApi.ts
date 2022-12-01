import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import {
  PostGenerateUploadUrlsRequest,
  PostGenerateUploadUrlsResponse,
} from '~/common/types';

const uploadApi = api.injectEndpoints({
  endpoints: (build) => ({
    generateUploadUrls: build.mutation<
      PostGenerateUploadUrlsResponse,
      PostGenerateUploadUrlsRequest
    >({
      query: (body) => ({
        url: apiPaths['generate-upload-urls'],
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { generateUploadUrls } = uploadApi.endpoints;
