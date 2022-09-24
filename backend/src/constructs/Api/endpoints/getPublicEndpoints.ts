import { ApiMethod, EndpointsOptions } from '~/constructs/Api/types';
import { ApiPath } from '~/types';

export type PublicEndpoints = Partial<Record<string, string[]>>;

export const getPublicEndpoints = (
  endpointsOptions: EndpointsOptions
): PublicEndpoints => {
  const result: PublicEndpoints = {};

  Object.entries(endpointsOptions).forEach(([path, { methods }]) => {
    const publicMethods: ApiMethod[] = [];

    Object.entries(methods).forEach(([methodName, { isPublic }]) => {
      if (isPublic) {
        publicMethods.push(methodName as ApiMethod);
      }
    });

    if (publicMethods.length) {
      result[path as ApiPath] = publicMethods;
    }
  });

  return result;
};
