import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { CachePolicy, Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { Entries } from 'type-fest';

import { Auth, Tables } from '~/constructs';
import { EndpointMethodOptions, EndpointsOptions } from '~/constructs/Api/types';

import { addApiRoute } from './addApiRoute';
import { addDistroBehavior, defaultCachePolicyProps } from './addDistroBehavior';
import { createAuthEdgeFunction } from './authEdgeFunction';
import { endpointsOptions } from './endpointsOptions';
import { getPublicEndpoints } from './getPublicEndpoints';

type CreateEndpointProps = {
  scope: Construct;
  distribution: Distribution;
  api: HttpApi;
  origin: HttpOrigin;
  auth: Auth;
  tables: Tables;
};

export const createEndpoints = ({
  scope,
  distribution,
  api,
  origin,
  auth,
  tables,
}: CreateEndpointProps) => {
  const options = endpointsOptions({ scope, auth, tables });
  const publicEndpoints = getPublicEndpoints(options);
  const userPoolAuthorizer = new HttpUserPoolAuthorizer('Authorizer', auth.userPool, {
    userPoolClients: [auth.userPoolClient],
  });

  const authEdgeFunction = createAuthEdgeFunction({
    scope,
    auth,
    tables,
    publicEndpoints,
  });

  const defaultCachePolicy = new CachePolicy(
    scope,
    'DefaultCachePolicy',
    defaultCachePolicyProps
  );

  (Object.entries(options) as Entries<EndpointsOptions>).forEach(
    ([path, { methods, ...distroBehaviourProps }]) => {
      Object.entries(methods).forEach(
        ([method, methodOptions]: [string, EndpointMethodOptions<unknown>]) => {
          addApiRoute({
            scope,
            api,
            path,
            method,
            methodOptions,
            userPoolAuthorizer,
          });
        }
      );

      addDistroBehavior({
        ...distroBehaviourProps,
        scope,
        distribution,
        origin,
        path,
        authEdgeFunction,
        publicEndpoints,
        defaultCachePolicy,
        methodNames: Object.keys(methods),
      });
    }
  );
};
