import { ApiPathMap } from '~/constructs/Api/types/ApiPathMap';

export type EndpointsCookies = ApiPathMap<{
  '/login': ['oauth'];
  '/loginCallback': ['oauth'];
  '/logout': ['sessionId'];
}>;
