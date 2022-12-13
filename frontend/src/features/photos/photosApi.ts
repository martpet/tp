import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import { PostPhotosRequest, PostPhotosResponse } from '~/common/types';

const photosApi = api.injectEndpoints({
  endpoints: (build) => ({
    createPhotos: build.query<PostPhotosResponse, PostPhotosRequest>({
      query: (body) => ({
        url: apiPaths.photos,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { createPhotos } = photosApi.endpoints;
