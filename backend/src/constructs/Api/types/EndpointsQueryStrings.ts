import { OnlyApiPaths } from '~/types';

export type EndpointsQueryStrings = OnlyApiPaths<{
  '/login': ['provider'];
  '/loginCallback': ['code', 'state'];
}>;

export type QueryStringParameters<T extends keyof EndpointsQueryStrings> = Partial<
  Record<EndpointsQueryStrings[T][number], string>
>;
