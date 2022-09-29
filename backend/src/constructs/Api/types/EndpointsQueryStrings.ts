import { ApiPathMap } from '~/constructs/Api/types/ApiPathMap';

export type EndpointsQueryStrings = ApiPathMap<{
  '/login': ['provider'];
  '/loginCallback': ['code', 'state'];
}>;

export type QueryStringParameters<T extends keyof EndpointsQueryStrings> = Partial<
  Record<EndpointsQueryStrings[T][number], string>
>;
