import { Duration } from 'aws-cdk-lib';
import {
  AddBehaviorOptions,
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
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Construct } from 'constructs';
import { Writable } from 'type-fest';

import { AuthorizationHeader } from '~/constructs/Api/types';

import { PublicEndpoints } from './getPublicEndpoints';

type AddDistroBehaviorProps = {
  scope: Construct;
  distribution: Distribution;
  origin: HttpOrigin;
  path: string;
  headers: string[];
  cookies: string[];
  queryStrings: Readonly<string[]>;
  authEdgeFunction: experimental.EdgeFunction;
  publicEndpoints: PublicEndpoints;
};

export const addDistroBehavior = ({
  scope,
  distribution,
  origin,
  path,
  cookies,
  headers,
  queryStrings,
  authEdgeFunction,
  publicEndpoints,
}: AddDistroBehaviorProps) => {
  const id = path.replace('/', '');
  const hasPrivateMethods = !Object.keys(publicEndpoints).includes(path);
  const originRequestPolicyProps: Writable<OriginRequestPolicyProps> = {};

  const cachePolicyProps: Writable<CachePolicyProps> = {
    defaultTtl: Duration.minutes(0),
    minTtl: Duration.minutes(0),
    maxTtl: Duration.seconds(1),
    cookieBehavior: CacheCookieBehavior.none(),
    queryStringBehavior: CacheQueryStringBehavior.none(),
  };

  const behaviorOptions: Writable<AddBehaviorOptions> = {
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    edgeLambdas: [],
  };

  if (hasPrivateMethods) {
    const authorizationHeader: Capitalize<AuthorizationHeader> = 'Authorization';
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

  behaviorOptions.cachePolicy = new CachePolicy(
    scope,
    `${id}CachePolicy`,
    cachePolicyProps
  );

  distribution.addBehavior(path, origin, behaviorOptions);
};
