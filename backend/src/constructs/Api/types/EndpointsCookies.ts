import { OnlyApiPaths } from '~/types';

export type EndpointsCookies = OnlyApiPaths<{
  '/login': ['oauth'];
  '/loginCallback': ['oauth'];
  '/logout': ['sessionId'];
}>;
