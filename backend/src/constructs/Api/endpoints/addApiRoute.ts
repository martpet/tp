import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpUserPoolAuthorizer } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Construct } from 'constructs';

import { EndpointMethodOptions } from '~/constructs/Api/types';
import { createNodejsFunction } from '~/constructs/utils';
import { capitalize } from '~/utils';

export type AddApiRouteProps = {
  scope: Construct;
  api: HttpApi;
  path: string;
  method: string;
  methodOptions: EndpointMethodOptions<unknown>;
  userPoolAuthorizer: HttpUserPoolAuthorizer;
};

export const addApiRoute = ({
  scope,
  api,
  path,
  method,
  methodOptions,
  userPoolAuthorizer,
}: AddApiRouteProps) => {
  const pathName = path.replace('/', '');
  const methodName = method.toLowerCase();
  const fileName = `${methodName}-${pathName}`;
  const id = `${capitalize(pathName)}${capitalize(methodName)}`;
  const { isPublic, environment, cb: callback } = methodOptions;

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

  if (callback) {
    callback(handler);
  }
};
