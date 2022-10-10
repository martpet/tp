import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { Auth, Tables } from '~/constructs';
import { AllEndpointsEnvVars } from '~/constructs/Api/types';
import { createNodejsFunction } from '~/constructs/utils';
import { apiOptions } from '~/consts';
import { ApiOptions, ApiPath } from '~/types';
import { capitalize } from '~/utils';

export type Props = {
  scope: Construct;
  api: HttpApi;
  auth: Auth;
  tables: Tables;
};

export const createRoutes = ({ scope, api, auth, tables }: Props) => {
  const envVars: AllEndpointsEnvVars = {
    authDomain: auth.authDomain,
    clientId: auth.userPoolClient.userPoolClientId,
    loginCallbackUrl: auth.loginCallbackUrl,
    logoutCallbackUrl: auth.logoutCallbackUrl,
    logoutCallbackLocalhostUrl: auth.logoutCallbackLocalhostUrl,
  };

  const handlersCallbacks: HandlerCallbacks = {
    '/loginCallback': (h) => tables.sessionsTable.grantWriteData(h),
    '/logout': (h) => tables.sessionsTable.grantWriteData(h),
  };

  const userPoolAuthorizer = new HttpUserPoolAuthorizer('Authorizer', auth.userPool, {
    userPoolClients: [auth.userPoolClient],
  });

  Object.entries(apiOptions as ApiOptions).forEach(([path, { methods }]) => {
    Object.entries(methods).forEach(([method, { isPublic }]) => {
      addApiRoute({
        scope,
        api,
        path,
        method,
        isPublic,
        userPoolAuthorizer,
        envVars,
        handlersCallbacks,
      });
    });
  });
};

type HandlerCallbacks = Partial<Record<ApiPath, (h: NodejsFunction) => void>>;

function addApiRoute({
  scope,
  api,
  path,
  method,
  isPublic,
  userPoolAuthorizer,
  envVars,
  handlersCallbacks,
}: Pick<Props, 'scope' | 'api'> & {
  path: string;
  method: string;
  isPublic?: boolean;
  userPoolAuthorizer: HttpUserPoolAuthorizer;
  envVars: AllEndpointsEnvVars;
  handlersCallbacks: HandlerCallbacks;
}) {
  const pathName = path.replace('/', '');
  const methodName = method.toLowerCase();
  const fileName = `${methodName}-${pathName}`;
  const id = `${capitalize(pathName)}${capitalize(methodName)}`;
  const envVarsKeys = (apiOptions as ApiOptions)[path as ApiPath].envVars;
  const environment: Record<string, string> = {};
  const handlerCallback = handlersCallbacks[path as ApiPath];

  if (envVarsKeys) {
    envVarsKeys.forEach((key) => {
      environment[key] = envVars[key as keyof AllEndpointsEnvVars];
    });
  }

  const handler = createNodejsFunction(scope, `Handler${id}`, {
    entry: `${__dirname}/handlers/${pathName}/${fileName}/${fileName}.ts`,
    environment,
  });

  api.addRoutes({
    path,
    methods: [method as HttpMethod],
    integration: new HttpLambdaIntegration(`${id}Integration`, handler),
    authorizer: isPublic ? undefined : userPoolAuthorizer,
  });

  if (handlerCallback) {
    handlerCallback(handler);
  }
}
