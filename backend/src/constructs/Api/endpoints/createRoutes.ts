import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Duration } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { Auth, Photos, Tables } from '~/constructs';
import { ApiEnvVars } from '~/constructs/Api/types';
import { createNodejsFunction } from '~/constructs/utils';
import { apiOptions } from '~/consts';
import { ApiMethodOptions } from '~/types';

import {
  CallbackMethod,
  CallbackPath,
  createRouteCallbacks,
} from './createRouteCallbacks';

export type Props = {
  scope: Construct;
  api: HttpApi;
  auth: Auth;
  tables: Tables;
  photos: Photos;
};

export const createRoutes = ({ scope, api, auth, tables, photos }: Props) => {
  const apiEnvVars: ApiEnvVars = {
    authDomain: auth.authDomain,
    clientId: auth.userPoolClient.userPoolClientId,
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

  const callbacks = createRouteCallbacks({ tables, photos });

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
        callback: callbacks[path as CallbackPath]?.[method as CallbackMethod],
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
  callback,
}: Pick<Props, 'scope' | 'api'> & {
  path: string;
  method: string;
  methodOptions: ApiMethodOptions;
  userPoolAuthorizer: HttpUserPoolAuthorizer;
  apiEnvVars: ApiEnvVars;
  callback?: (fn: NodejsFunction) => void;
}) {
  const formattedPathName = path.replace('/', '').toLowerCase();
  const formattedMethodName = method.toLowerCase();
  const fileName = `${formattedMethodName}-${formattedPathName}`;
  const handlerId = `${formattedMethodName}-${formattedPathName}`;
  const handlerEnvironment: Record<string, string> = {};
  const { isPublic, envVars = [] } = methodOptions;

  envVars.forEach((key) => {
    handlerEnvironment[key] = apiEnvVars[key as keyof ApiEnvVars];
  });

  const handler = createNodejsFunction(scope, `api-handler-${handlerId}`, {
    entry: `${__dirname}/handlers/${formattedPathName}/${fileName}/${fileName}.ts`,
    environment: handlerEnvironment,
    timeout: Duration.seconds(30),
    functionName: `api-handler--${formattedPathName.toLowerCase()}-${formattedMethodName.toUpperCase()}`,
  });

  api.addRoutes({
    path,
    methods: [method as HttpMethod],
    integration: new HttpLambdaIntegration(`http-integration-${handlerId}`, handler),
    authorizer: isPublic ? undefined : userPoolAuthorizer,
  });

  if (callback) {
    callback(handler);
  }
}
