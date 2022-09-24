import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';

import { Auth, Tables } from '~/constructs';
import { EndpointMethodOptions } from '~/constructs/Api/types';
import { EnvName } from '~/types';

import { addApiRoute } from './addApiRoute';
import { addDistroBehavior } from './addDistroBehavior';
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
  envName: EnvName;
};

export const createEndpoints = ({
  scope,
  distribution,
  api,
  origin,
  auth,
  tables,
  envName,
}: CreateEndpointProps) => {
  const options = endpointsOptions({ auth, tables, envName });
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

  Object.entries(options).forEach(
    ([path, { methods, cookies = [], headers = [], queryStrings = [] }]) => {
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
        scope,
        distribution,
        origin,
        path,
        headers,
        cookies,
        queryStrings,
        authEdgeFunction,
        publicEndpoints,
      });
    }
  );
};
