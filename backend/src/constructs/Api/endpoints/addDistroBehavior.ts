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
  ResponseSecurityHeadersBehavior,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import deepmerge from 'deepmerge';
import { PartialDeep, Writable } from 'type-fest';

import { AuthorizationHeader } from '~/constructs/Api/types';
import { appEnvs } from '~/consts';
import { ApiPath } from '~/types';
import { getEnvName } from '~/utils';

import { defaultSecurityHeadersBehavior } from './defaultSecurityHeadersBehavior';
import { PublicEndpoints } from './getPublicEndpoints';

export const defaultCachePolicyProps: CachePolicyProps = {
  defaultTtl: Duration.minutes(0),
  minTtl: Duration.minutes(0),
  maxTtl: Duration.seconds(1), // https://github.com/aws/aws-cdk/issues/13408
  cookieBehavior: CacheCookieBehavior.none(),
  queryStringBehavior: CacheQueryStringBehavior.none(),
};

type AddDistroBehaviorProps = {
  scope: Construct;
  distribution: Distribution;
  origin: HttpOrigin;
  path: ApiPath;
  methodNames: string[];
  headers?: string[];
  cookies?: string[];
  queryStrings?: Readonly<string[]>;
  securityHeadersBehavior?: PartialDeep<ResponseSecurityHeadersBehavior>;
  authEdgeFunction: experimental.EdgeFunction;
  publicEndpoints: PublicEndpoints;
  defaultCachePolicy: CachePolicy;
};

export const addDistroBehavior = ({
  scope,
  distribution,
  origin,
  path,
  methodNames,
  headers = [],
  cookies = [],
  queryStrings = [],
  securityHeadersBehavior = {},
  authEdgeFunction,
  publicEndpoints,
  defaultCachePolicy,
}: AddDistroBehaviorProps) => {
  const id = path.replace('/', '');
  const envName = getEnvName(scope);
  const { appDomain } = appEnvs[envName];
  const authorizationHeader: Capitalize<AuthorizationHeader> = 'Authorization';
  const hasPrivateMethods = !Object.keys(publicEndpoints).includes(path);
  const cachePolicyProps: Writable<CachePolicyProps> = {};
  const originRequestPolicyProps: Writable<OriginRequestPolicyProps> = {};

  const corsBehavior: Writable<ResponseHeadersCorsBehavior> = {
    accessControlAllowCredentials: true,
    accessControlAllowHeaders: [authorizationHeader],
    accessControlAllowMethods: methodNames,
    accessControlAllowOrigins: [envName === 'personal' ? '*' : `https://${appDomain}`],
    accessControlMaxAge: Duration.hours(1),
    originOverride: true,
  };

  const behaviorOptions: Writable<AddBehaviorOptions> = {
    edgeLambdas: [],
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    allowedMethods: AllowedMethods.ALLOW_ALL,
  };

  if (hasPrivateMethods) {
    cachePolicyProps.headerBehavior = CacheHeaderBehavior.allowList(authorizationHeader);
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

  if (Object.keys(cachePolicyProps).length) {
    behaviorOptions.cachePolicy = new CachePolicy(scope, `${id}CachePolicy`, {
      ...defaultCachePolicyProps,
      ...cachePolicyProps,
    });
  } else {
    behaviorOptions.cachePolicy = defaultCachePolicy;
  }

  behaviorOptions.responseHeadersPolicy = new ResponseHeadersPolicy(
    scope,
    `${id}ResponseHeaderPolicy`,
    {
      corsBehavior,
      securityHeadersBehavior: deepmerge(
        defaultSecurityHeadersBehavior,
        securityHeadersBehavior,
        { clone: false }
      ) as ResponseSecurityHeadersBehavior,
    }
  );

  distribution.addBehavior(path, origin, behaviorOptions);
};
