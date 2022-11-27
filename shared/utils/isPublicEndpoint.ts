import { publicEndpoints } from '../consts/publicEndpoints';
import { ApiMethod, ApiPath } from '../types';

type Props = {
  path: string;
  method: string;
};

export function isPublicEndpoint({ path, method }: Props) {
  return Boolean(publicEndpoints[path as ApiPath]?.includes(method as ApiMethod));
}
