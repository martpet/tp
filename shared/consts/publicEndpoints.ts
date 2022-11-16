import { ApiRoutes } from '../types';
import { getPublicEndpoints } from '../utils';
import { apiRoutes } from './apiRoutes';

export const publicEndpoints = getPublicEndpoints(apiRoutes as ApiRoutes);
