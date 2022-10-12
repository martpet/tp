import { Replace } from 'type-fest';

import { ApiPath } from '../types';
import { apiOptions } from './apiOptions';

export const apiPaths = Object.fromEntries(
  Object.keys(apiOptions).map((key) => [key.replace('/', ''), key])
) as Record<Replace<ApiPath, '/', ''>, ApiPath>;
