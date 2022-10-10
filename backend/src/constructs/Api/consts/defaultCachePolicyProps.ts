import { Duration } from 'aws-cdk-lib';
import {
  CacheCookieBehavior,
  CachePolicyProps,
  CacheQueryStringBehavior,
} from 'aws-cdk-lib/aws-cloudfront';

export const defaultCachePolicyProps: CachePolicyProps = {
  defaultTtl: Duration.minutes(0),
  minTtl: Duration.minutes(0),
  maxTtl: Duration.seconds(1), // https://github.com/aws/aws-cdk/issues/13408
  cookieBehavior: CacheCookieBehavior.none(),
  queryStringBehavior: CacheQueryStringBehavior.none(),
};
