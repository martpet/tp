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
import { getSecurityHeadersBehavior } from '~/constructs/Api/endpoints/getSecurityHeadersBehavior';
import { apiOptions, appEnvs, publicEndpoints } from '~/consts';
import { ApiOptions, ApiPath } from '~/types';
import { getAllowedOrigins, getEnvName } from '~/utils';

import { createAuthEdgeFunction } from './authEdgeFunction/createAuthEdgeFunction';

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
    cachePolicyName: 'api-distro-default-cache-policy',
    defaultTtl: Duration.minutes(0),
    minTtl: Duration.minutes(0),
    maxTtl: Duration.seconds(1), // https://github.com/aws/aws-cdk/issues/13408#issuecomment-1082438705
    cookieBehavior: CacheCookieBehavior.none(),
    queryStringBehavior: CacheQueryStringBehavior.none(),
  };

  const defaultCachePolicy = new CachePolicy(
    scope,
    'api-distro-default-cache-policy',
    defaultCachePolicyProps
  );

  (Object.keys(apiOptions) as ApiPath[]).forEach((path) => {
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
  } = (apiOptions as ApiOptions)[path];

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
    `api-distro-response-headers-policy--${id}`,
    {
      responseHeadersPolicyName: `api-distro--headers-policy--${id}`,
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
    behaviorOptions.cachePolicy = new CachePolicy(
      scope,
      `api-distro-cache-policy--${id}`,
      {
        ...defaultCachePolicyProps,
        ...customCachePolicyProps,
        cachePolicyName: `api-distro-cache-policy--${id}`,
      }
    );
  }

  if (Object.keys(originRequestPolicyProps).length) {
    behaviorOptions.originRequestPolicy = new OriginRequestPolicy(
      scope,
      `api-distro-origin-request-policy--${id}`,
      {
        ...originRequestPolicyProps,
        originRequestPolicyName: `api-distro-origin-request-policy--${id}`,
      }
    );
  }

  distribution.addBehavior(path, origin, behaviorOptions);
}
