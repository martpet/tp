import { ApiPaths } from '../types/ApiPath';
import { apiOptions } from './apiOptions';

export const apiPaths = Object.fromEntries(
  Object.keys(apiOptions).map((key) => [key.replace('/', ''), key])
) as ApiPaths;
