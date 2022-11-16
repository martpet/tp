import { ApiMethod, ApiPath, ApiRoutes } from '../types';

export const getPublicEndpoints = (apiRoutes: ApiRoutes) => {
  const result: Partial<Record<ApiPath, ApiMethod[]>> = {};

  Object.entries(apiRoutes as ApiRoutes).forEach(([path, { methods }]) => {
    const publicMethods: ApiMethod[] = [];

    Object.entries(methods).forEach(([method, { isPublic }]) => {
      if (isPublic) {
        publicMethods.push(method as ApiMethod);
      }
    });

    if (publicMethods.length) {
      result[path as ApiPath] = publicMethods;
    }
  });

  return result;
};
