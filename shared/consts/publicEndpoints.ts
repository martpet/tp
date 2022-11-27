import { ApiOptions } from '../types';
import { getPublicEndpoints } from '../utils/getPublicEndpoints';
import { apiOptions } from './apiOptions';

export const publicEndpoints = getPublicEndpoints(apiOptions as ApiOptions);
