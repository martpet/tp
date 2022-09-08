import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RequireAtLeastOne } from 'type-fest';

import { ApiPath } from '~/types';

import { EndpointsCookies } from './EndpointsCookies';
import {
  EndpointsEnvironemntsKeys,
  EndpointsEnvironments,
} from './EndpointsEnvironments';
import { EndpointsHeaders } from './EndpointsHeaders';
import { EndpointQueryStrings } from './EndpointsQueryStrings';

type Methods = 'GET' | 'POST';

type EnvironmentProp<T> = T extends keyof EndpointsEnvironemntsKeys
  ? { environment: EndpointsEnvironments<T> }
  : { environment?: never };

type CookiesProp<T> = T extends keyof EndpointsCookies
  ? { cookies: EndpointsCookies[T] }
  : { cookies?: never };

type HeadersProp<T> = T extends keyof EndpointsHeaders
  ? { headers: EndpointsHeaders[T] }
  : { headers?: never };

type QueryStringsProp<T> = T extends keyof EndpointQueryStrings
  ? { queryStrings: EndpointQueryStrings[T] }
  : { queryStrings?: never };

export type MethodOptions<T> = {
  cb?: (x: NodejsFunction) => void;
} & EnvironmentProp<T>;

export type MethodsOptions<T> = {
  [key in Methods]: MethodOptions<T>;
};

type EndpointOptions<T> = {
  methods: RequireAtLeastOne<MethodsOptions<T>, Methods>;
} & HeadersProp<T> &
  CookiesProp<T> &
  QueryStringsProp<T>;

export type EndpointsOptions = {
  [path in ApiPath]: EndpointOptions<path>;
};
