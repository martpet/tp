import { Duration } from 'aws-cdk-lib';
import {
  HeadersFrameOption,
  HeadersReferrerPolicy,
  ResponseSecurityHeadersBehavior,
} from 'aws-cdk-lib/aws-cloudfront';

export const defaultSecurityHeadersBehavior: ResponseSecurityHeadersBehavior = {
  contentSecurityPolicy: {
    contentSecurityPolicy: `default-src none`,
    override: true,
  },
  contentTypeOptions: { override: true },
  frameOptions: { frameOption: HeadersFrameOption.DENY, override: true },
  referrerPolicy: {
    referrerPolicy: HeadersReferrerPolicy.NO_REFERRER,
    override: true,
  },
  strictTransportSecurity: {
    accessControlMaxAge: Duration.seconds(600),
    includeSubdomains: true,
    override: true,
  },
  xssProtection: {
    protection: true,
    modeBlock: true,
    override: true,
    // reportUri: 'https://example.com/csp-report',
  },
};
