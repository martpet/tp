import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {
  CachePolicy,
  Distribution,
  OriginRequestCookieBehavior,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestPolicyProps,
  OriginRequestQueryStringBehavior,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Writable } from 'type-fest';

import { capitalize, createNodejsFunction } from '~/utils';

import { EndpointsOptions, MethodOptions } from './apiTypes';

type CreateEndpointProps = {
  scope: Construct;
  distribution: Distribution;
  api: HttpApi;
  origin: HttpOrigin;
  options: EndpointsOptions;
};

export const createEndpoints = ({
  scope,
  distribution,
  api,
  origin,
  options,
}: CreateEndpointProps) => {
  Object.entries(options).forEach(
    ([path, { methods, cookies, headers, queryStrings }]) => {
      addDistroBehavior({
        scope,
        distribution,
        origin,
        path,
        headers,
        cookies,
        queryStrings,
      });

      Object.entries(methods).forEach(([method, methodOptions]) => {
        addApiRoute({ scope, api, path, method, methodOptions });
      });
    }
  );
};

type AddDistroBehaviorProps = {
  scope: Construct;
  distribution: Distribution;
  origin: HttpOrigin;
  path: string;
  headers?: string[];
  cookies?: string[];
  queryStrings?: Readonly<string[]>;
};

function addDistroBehavior({
  scope,
  distribution,
  origin,
  path,
  cookies,
  headers,
  queryStrings,
}: AddDistroBehaviorProps) {
  const pathName = path.replace('/', '');
  const policyProps: Writable<OriginRequestPolicyProps> = {};

  if (headers) {
    policyProps.headerBehavior = OriginRequestHeaderBehavior.allowList(...headers);
  }

  if (cookies) {
    policyProps.cookieBehavior = OriginRequestCookieBehavior.allowList(...cookies);
  }

  if (queryStrings) {
    policyProps.queryStringBehavior = OriginRequestQueryStringBehavior.allowList(
      ...queryStrings
    );
  }

  distribution.addBehavior(path, origin, {
    cachePolicy: CachePolicy.CACHING_DISABLED,
    originRequestPolicy: new OriginRequestPolicy(scope, pathName, policyProps),
  });
}

type AddApiRouteProps = {
  scope: Construct;
  api: HttpApi;
  path: string;
  method: string;
  methodOptions: MethodOptions<unknown>;
};

function addApiRoute({ scope, api, path, method, methodOptions }: AddApiRouteProps) {
  const pathName = path.replace('/', '');
  const methodName = method.toLowerCase();
  const fileName = `${methodName}-${pathName}`;
  const id = `${capitalize(methodName)}${capitalize(fileName)}`;
  const { environment, cb } = methodOptions;
  const handlerProps: Writable<NodejsFunctionProps> = {
    entry: `${__dirname}/handlers/${pathName}/${fileName}/${fileName}.ts`,
    environment,
  };

  const handler = createNodejsFunction(scope, `${id}Handler`, handlerProps);

  if (cb) {
    cb(handler);
  }

  api.addRoutes({
    path,
    methods: [method as HttpMethod],
    integration: new HttpLambdaIntegration(`${id}Integration`, handler),
  });
}
