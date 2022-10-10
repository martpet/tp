import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Duration } from 'aws-cdk-lib';
import {
  AddBehaviorOptions,
  AllowedMethods,
  CacheHeaderBehavior,
  CachePolicy,
  CachePolicyProps,
  Distribution,
  experimental,
  HeadersReferrerPolicy,
  LambdaEdgeEventType,
  OriginRequestCookieBehavior,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestPolicyProps,
  OriginRequestQueryStringBehavior,
  ResponseHeadersCorsBehavior,
  ResponseHeadersPolicy,
  ResponseSecurityHeadersBehavior,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import deepmerge from 'deepmerge';
import { PartialDeep, Writable } from 'type-fest';

import { Auth, Tables } from '~/constructs';
import {
  authorizationHeader,
  defaultCachePolicyProps,
  defaultSecurityHeadersBehavior,
} from '~/constructs/Api/consts';
import { apiOptions, appEnvs, publicEndpoints } from '~/consts';
import { ApiOptions, ApiPath } from '~/types';
import { getEnvName } from '~/utils';

import { createAuthEdgeFunction } from './authEdgeFunction';
import { createLoginCallbackScript } from './handlers/loginCallback/get-loginCallback/createLoginCallbackScript';

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

  const defaultCachePolicy = new CachePolicy(
    scope,
    'CachePolicy',
    defaultCachePolicyProps
  );

  (Object.keys(apiOptions) as ApiPath[]).forEach((path) => {
    addBehavior({
      scope,
      origin,
      distribution,
      authEdgeFunction,
      defaultCachePolicy,
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
  path,
}: Pick<Props, 'scope' | 'origin' | 'distribution'> & {
  path: ApiPath;
  authEdgeFunction: experimental.EdgeFunction;
  defaultCachePolicy: CachePolicy;
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

  const behaviorOptions: Writable<AddBehaviorOptions> = {
    edgeLambdas: [],
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    allowedMethods: AllowedMethods.ALLOW_ALL,
  };

  const customSecurityHeadersBehaviors: Partial<
    Record<ApiPath, PartialDeep<ResponseSecurityHeadersBehavior>>
  > = {
    '/loginCallback': {
      contentSecurityPolicy: {
        contentSecurityPolicy: `script-src '${
          createLoginCallbackScript({ envName, appDomain }).cspHash
        }'`,
      },
    },
    '/logout': {
      referrerPolicy: {
        referrerPolicy: HeadersReferrerPolicy.NO_REFERRER_WHEN_DOWNGRADE,
      },
    },
  };

  const corsBehavior: Writable<ResponseHeadersCorsBehavior> = {
    accessControlAllowCredentials: true,
    accessControlAllowHeaders: [authorizationHeader],
    accessControlAllowMethods: Object.keys(methods),
    accessControlAllowOrigins: [envName === 'personal' ? '*' : `https://${appDomain}`],
    accessControlMaxAge: Duration.hours(1),
    originOverride: true,
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
    corsBehavior.accessControlAllowHeaders.concat(headers);
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

  if (Object.keys(originRequestPolicyProps).length) {
    behaviorOptions.originRequestPolicy = new OriginRequestPolicy(
      scope,
      `${id}OriginRequestPolicy`,
      originRequestPolicyProps
    );
  }

  if (Object.keys(customCachePolicyProps).length) {
    behaviorOptions.cachePolicy = new CachePolicy(scope, `${id}CachePolicy`, {
      ...defaultCachePolicyProps,
      ...customCachePolicyProps,
    });
  } else {
    behaviorOptions.cachePolicy = defaultCachePolicy;
  }

  const securityHeadersBehavior = deepmerge(
    defaultSecurityHeadersBehavior,
    customSecurityHeadersBehaviors[path] || {},
    { clone: false }
  ) as ResponseSecurityHeadersBehavior;

  behaviorOptions.responseHeadersPolicy = new ResponseHeadersPolicy(
    scope,
    `${id}ResponseHeaderPolicy`,
    { corsBehavior, securityHeadersBehavior }
  );

  distribution.addBehavior(path, origin, behaviorOptions);
}
