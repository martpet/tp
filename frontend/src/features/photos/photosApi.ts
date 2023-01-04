import { api } from '~/app/services';
import { apiPaths } from '~/common/consts';
import {
  PostPhotosRequest,
  PostPhotosResponse,
  UplaodableFileMeta,
} from '~/common/types';

const photosApi = api.injectEndpoints({
  endpoints: (build) => ({
    createPhotos: build.mutation<PostPhotosResponse, UplaodableFileMeta[]>({
      query: (files) => {
        const body: PostPhotosRequest = files.map(({ fingerprint, exif }) => ({
          fingerprint,
          ...exif,
        }));
        return {
          url: apiPaths.photos,
          method: 'POST',
          body,
        };
      },
    }),
  }),
});

export const { createPhotos } = photosApi.endpoints;
