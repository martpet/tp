import { ApiPaths } from '../types';
import { apiRoutes } from './apiRoutes';

export const apiPaths = Object.fromEntries(
  Object.keys(apiRoutes).map((key) => [key.replace('/', ''), key])
) as ApiPaths;
