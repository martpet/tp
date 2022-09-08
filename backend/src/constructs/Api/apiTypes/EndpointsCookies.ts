import { FromApiPaths } from '~/types';

export type EndpointsCookies = FromApiPaths<{
  '/login': ['oauth'];
  '/loginCallback': ['oauth'];
  '/logout': ['session'];
}>;
