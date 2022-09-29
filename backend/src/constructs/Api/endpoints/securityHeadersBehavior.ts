import { Duration } from 'aws-cdk-lib';
import {
  HeadersFrameOption,
  HeadersReferrerPolicy,
  ResponseSecurityHeadersBehavior,
} from 'aws-cdk-lib/aws-cloudfront';

export const securityHeadersBehavior: ResponseSecurityHeadersBehavior = {
  contentSecurityPolicy: {
    // sha256 hash for the inline script in get-loginCallback
    // todo: add the hash only for get-loginCallback in addDistroBehavior
    contentSecurityPolicy: `script-src 'sha256-rqwIreIIUGvrQThl0woaQ+qdBYaeNzCCVpnymkdmkK0=' https:;`,
    override: true,
  },
  contentTypeOptions: { override: true },
  frameOptions: { frameOption: HeadersFrameOption.DENY, override: true },
  referrerPolicy: {
    referrerPolicy: HeadersReferrerPolicy.NO_REFERRER_WHEN_DOWNGRADE,
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
    // reportUri: 'https://example.com/csp-report',
    override: true,
  },
};
