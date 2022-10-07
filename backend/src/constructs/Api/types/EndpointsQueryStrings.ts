import { ApiPathMap } from '~/constructs/Api/types/ApiPathMap';

// Todo: declare query strings as consts and use them directly in endpointOptions

export type EndpointsQueryStrings = ApiPathMap<{
  '/login': ['provider'];
  '/loginCallback': ['code', 'state', 'error', 'error_description'];
}>;

export type QueryStringParameters<T extends keyof EndpointsQueryStrings> = Partial<
  Record<EndpointsQueryStrings[T][number], string>
>;
