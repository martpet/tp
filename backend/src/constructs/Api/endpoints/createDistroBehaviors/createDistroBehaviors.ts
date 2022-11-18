import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Duration } from 'aws-cdk-lib';
import {
  AddBehaviorOptions,
  AllowedMethods,
  CacheCookieBehavior,
  CacheHeaderBehavior,
  CachePolicy,
  CachePolicyProps,
  CacheQueryStringBehavior,
  Distribution,
  experimental,
  LambdaEdgeEventType,
  OriginRequestCookieBehavior,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestPolicyProps,
  OriginRequestQueryStringBehavior,
  ResponseHeadersCorsBehavior,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { Writable } from 'type-fest';

import { Auth, Tables } from '~/constructs';
import { authorizationHeader } from '~/constructs/Api/consts';
import { getSecurityHeadersBehavior } from '~/constructs/Api/endpoints/createDistroBehaviors/getSecurityHeadersBehavior';
import { apiRoutes, appEnvs, publicEndpoints } from '~/consts';
import { ApiPath, ApiRoutes } from '~/types';
import { getAllowedOrigins, getEnvName } from '~/utils';

import { createAuthEdgeFunction } from '../authEdgeFunction';

type Props = {
  scope: Construct;
  api: HttpApi;
  origin: HttpOrigin;
  distribution: Distribution;
  auth: Auth;
  tables: Tables;
};

export const createDistroBehaviors = ({
  scope,
  auth,
  tables,
  origin,
  distribution,
}: Props) => {
  const authEdgeFunction = createAuthEdgeFunction({ scope, auth, tables });

  const defaultCachePolicyProps: CachePolicyProps = {
    defaultTtl: Duration.minutes(0),
    minTtl: Duration.minutes(0),
    maxTtl: Duration.seconds(1), // 1s - https://github.com/aws/aws-cdk/issues/13408
    cookieBehavior: CacheCookieBehavior.none(),
    queryStringBehavior: CacheQueryStringBehavior.none(),
  };

  const defaultCachePolicy = new CachePolicy(
    scope,
    'CachePolicy',
    defaultCachePolicyProps
  );

  (Object.keys(apiRoutes) as ApiPath[]).forEach((path) => {
    addBehavior({
      scope,
      origin,
      distribution,
      authEdgeFunction,
      defaultCachePolicy,
      defaultCachePolicyProps,
      path,
    });
  });
};

function addBehavior({
  scope,
  origin,
  distribution,
  authEdgeFunction,
  defaultCachePolicy,
  defaultCachePolicyProps,
  path,
}: Pick<Props, 'scope' | 'origin' | 'distribution'> & {
  path: ApiPath;
  authEdgeFunction: experimental.EdgeFunction;
  defaultCachePolicy: CachePolicy;
  defaultCachePolicyProps: CachePolicyProps;
}) {
  const id = path.replace('/', '');
  const envName = getEnvName(scope);
  const { appDomain } = appEnvs[envName];
  const hasPrivateEndpoints = !Object.keys(publicEndpoints).includes(path);
  const customCachePolicyProps: Writable<CachePolicyProps> = {};
  const originRequestPolicyProps: Writable<OriginRequestPolicyProps> = {};
  const {
    methods,
    headers = [],
    cookies = [],
    queryStrings = [],
  } = (apiRoutes as ApiRoutes)[path];

  const corsBehavior: ResponseHeadersCorsBehavior = {
    accessControlAllowCredentials: true,
    accessControlAllowHeaders: ['content-type'],
    accessControlAllowMethods: Object.keys(methods),
    accessControlAllowOrigins: getAllowedOrigins(scope),
    accessControlMaxAge: Duration.days(1),
    originOverride: true,
  };

  const responseHeadersPolicy = new ResponseHeadersPolicy(
    scope,
    `${id}ResponseHeaderPolicy`,
    {
      corsBehavior,
      securityHeadersBehavior: getSecurityHeadersBehavior({ envName, appDomain, path }),
    }
  );

  const behaviorOptions: Writable<AddBehaviorOptions> = {
    edgeLambdas: [],
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    allowedMethods: AllowedMethods.ALLOW_ALL,
    responseHeadersPolicy,
    cachePolicy: defaultCachePolicy,
  };

  if (hasPrivateEndpoints) {
    customCachePolicyProps.headerBehavior =
      CacheHeaderBehavior.allowList(authorizationHeader);

    behaviorOptions.edgeLambdas?.push({
      eventType: LambdaEdgeEventType.VIEWER_REQUEST,
      functionVersion: authEdgeFunction.currentVersion,
    });
  }

  if (headers.length) {
    originRequestPolicyProps.headerBehavior = OriginRequestHeaderBehavior.allowList(
      ...headers
    );
  }

  if (cookies.length) {
    originRequestPolicyProps.cookieBehavior = OriginRequestCookieBehavior.allowList(
      ...cookies
    );
  }

  if (queryStrings.length) {
    originRequestPolicyProps.queryStringBehavior =
      OriginRequestQueryStringBehavior.allowList(...queryStrings);
  }

  if (Object.keys(customCachePolicyProps).length) {
    behaviorOptions.cachePolicy = new CachePolicy(scope, `${id}CachePolicy`, {
      ...defaultCachePolicyProps,
      ...customCachePolicyProps,
    });
  }

  if (Object.keys(originRequestPolicyProps).length) {
    behaviorOptions.originRequestPolicy = new OriginRequestPolicy(
      scope,
      `${id}OriginRequestPolicy`,
      originRequestPolicyProps
    );
  }

  distribution.addBehavior(path, origin, behaviorOptions);
}
