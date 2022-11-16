import { Replace } from 'type-fest';

import { apiRoutes } from '../consts/apiRoutes';

export type ApiPath = keyof typeof apiRoutes;

export type ApiPaths = {
  [key in Replace<ApiPath, '/', ''>]: `/${key}`;
};
