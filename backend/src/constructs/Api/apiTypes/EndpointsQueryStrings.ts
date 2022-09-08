import { FromApiPaths } from '~/types';

export type EndpointQueryStrings = FromApiPaths<{
  '/login': ['provider'];
  '/loginCallback': ['code', 'state'];
}>;

export type QueryStringParameters<T extends keyof EndpointQueryStrings> = Partial<
  Record<EndpointQueryStrings[T][number], string>
>;
