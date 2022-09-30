import { ResponseSecurityHeadersBehavior } from 'aws-cdk-lib/aws-cloudfront';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PartialDeep, RequireAtLeastOne } from 'type-fest';

import {
  ApiMethod,
  EndpointsCookies,
  EndpointsEnvironemntsKeys,
  EndpointsEnvironments,
  EndpointsHeaders,
  EndpointsQueryStrings,
} from '~/constructs/Api/types';
import { ApiPath } from '~/types';

export type EndpointsOptions = {
  [K in ApiPath]: (HeadersProp<K> & CookiesProp<K> & QueryStringsProp<K>) & {
    methods: RequireAtLeastOne<
      { [mk in ApiMethod]: EndpointMethodOptions<K> },
      ApiMethod
    >;
    securityHeadersBehavior?: PartialDeep<ResponseSecurityHeadersBehavior>;
  };
};

export type EndpointMethodOptions<T> = EnvironmentProp<T> & {
  isPublic?: true;
  cb?: (x: NodejsFunction) => void;
};

type HeadersProp<T> = T extends keyof EndpointsHeaders
  ? { headers: EndpointsHeaders[T] }
  : { headers?: never };

type CookiesProp<T> = T extends keyof EndpointsCookies
  ? { cookies: EndpointsCookies[T] }
  : { cookies?: never };

type QueryStringsProp<T> = T extends keyof EndpointsQueryStrings
  ? { queryStrings: EndpointsQueryStrings[T] }
  : { queryStrings?: never };

type EnvironmentProp<T> = T extends keyof EndpointsEnvironemntsKeys
  ? { environment: EndpointsEnvironments<T> }
  : { environment?: never };
