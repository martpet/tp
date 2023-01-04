import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { FileMeta, PostUploadUrlsRequest, PostUploadUrlsResponse } from '~/common/types';

const uploadApi = api.injectEndpoints({
  endpoints: (build) => ({
    createUploadUrls: build.mutation<PostUploadUrlsResponse, FileMeta[]>({
      query: (files) => {
        const body: PostUploadUrlsRequest = files.map(({ id, fingerprint, digest }) => ({
          id,
          fingerprint,
          digest,
        }));
        return {
          url: apiPaths['upload-urls'],
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const { createUploadUrls } = uploadApi.endpoints;
