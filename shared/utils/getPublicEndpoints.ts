import { ApiMethod, ApiPath, ApiOptions } from '../types';

export const getPublicEndpoints = (apiOptions: ApiOptions) => {
  const result: Partial<Record<ApiPath, ApiMethod[]>> = {};

  Object.entries(apiOptions as ApiOptions).forEach(([path, { methods }]) => {
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
