import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Duration } from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { Auth, Photos, Tables } from '~/constructs';
import { AllEnvVars } from '~/constructs/Api/types';
import { createNodejsFunction } from '~/constructs/utils';
import { apiOptions } from '~/consts';
import { ApiMethodOptions } from '~/types';

import {
  getPermissionsCallbacks,
  MethodWithPermissions,
  PathWithPermissions,
} from './permissoins';

export type Props = {
  scope: Construct;
  api: HttpApi;
  auth: Auth;
  tables: Tables;
  photos: Photos;
};

export const createRoutes = ({ scope, api, auth, tables, photos }: Props) => {
  const apiEnvVars: AllEnvVars = {
    authDomain: auth.authDomain,
    clientId: auth.userPoolClient.userPoolClientId,
    identityPoolId: auth.publicIdentityPool.identityPoolId,
    loginCallbackUrl: auth.loginCallbackUrl,
    logoutCallbackUrl: auth.logoutCallbackUrl,
    logoutCallbackLocalhostUrl: auth.logoutCallbackLocalhostUrl,
    photoBucket: photos.bucket.bucketName,
  };

  const userPoolAuthorizer = new HttpUserPoolAuthorizer(
    'user-pool-authorizer',
    auth.userPool,
    { userPoolClients: [auth.userPoolClient] }
  );

  Object.entries(apiOptions).forEach(([path, { methods }]) => {
    Object.entries(methods).forEach(([method, methodOptions]) => {
      createRoute({
        scope,
        api,
        path,
        method,
        methodOptions,
        userPoolAuthorizer,
        apiEnvVars,
        permissionsCallback: getPermissionsCallbacks({ tables, photos })[
          path as PathWithPermissions
        ]?.[method as MethodWithPermissions],
      });
    });
  });
};

function createRoute({
  scope,
  api,
  path,
  method,
  methodOptions,
  userPoolAuthorizer,
  apiEnvVars,
  permissionsCallback,
}: Pick<Props, 'scope' | 'api'> & {
  path: string;
  method: string;
  methodOptions: ApiMethodOptions;
  userPoolAuthorizer: HttpUserPoolAuthorizer;
  apiEnvVars: AllEnvVars;
  permissionsCallback?: (fn: NodejsFunction) => void;
}) {
  const formattedPath = path.replace('/', '').toLowerCase();
  const formattedMethod = method.toLowerCase();
  const fileName = `${formattedMethod}-${formattedPath}`;
  const handlerEnvironment: Record<string, string> = {};
  const { isPublic, pathParam, envVars = [] } = methodOptions;

  envVars.forEach((key) => {
    handlerEnvironment[key] = apiEnvVars[key as keyof AllEnvVars];
  });

  const functionProps = methodOptions.nodejsFunctionProps as NodejsFunctionProps;

  const handler = createNodejsFunction(scope, `api-handler-${fileName}`, {
    entry: `${__dirname}/handlers/${formattedPath}/${fileName}/${fileName}.ts`,
    environment: handlerEnvironment,
    timeout: Duration.seconds(30),
    functionName: `api-handler--${formattedPath.toLowerCase()}-${formattedMethod.toUpperCase()}`,
    ...functionProps,
  });

  api.addRoutes({
    path: `${path}${pathParam ? `/{${pathParam}}` : ''}`,
    methods: [method as HttpMethod],
    integration: new HttpLambdaIntegration(`http-integration-${fileName}`, handler),
    authorizer: isPublic ? undefined : userPoolAuthorizer,
  });

  if (permissionsCallback) {
    permissionsCallback(handler);
  }
}
