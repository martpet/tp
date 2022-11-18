import { Replace } from 'type-fest';

import { apiOptions } from '../consts/apiOptions';

export type ApiPath = keyof typeof apiOptions;

export type ApiPaths = {
  [key in Replace<ApiPath, '/', ''>]: `/${key}`;
};
