import { Duration } from 'aws-cdk-lib';
import {
  HeadersFrameOption,
  HeadersReferrerPolicy,
  ResponseSecurityHeadersBehavior,
} from 'aws-cdk-lib/aws-cloudfront';

import { EnvName } from '~/types';

type CreateSecurityHeadersBehaviorProps = {
  envName: EnvName;
};

export const createSecurityHeadersBehavior = ({
  envName,
}: CreateSecurityHeadersBehaviorProps): ResponseSecurityHeadersBehavior => {
  const loginCallbackInlineScriptHash = {
    personal: 'sha256-rqwIreIIUGvrQThl0woaQ+qdBYaeNzCCVpnymkdmkK0=',
    staging: 'sha256-53z1HluNxjChHwx03hANSQ2TBNNaFiPPVycoJhmcMB4=',
    production: 'sha256-fn5JJ+ebDOhaPixGPfPsZ5GoIs+GUUMjqbIdj/38HAk=',
  }[envName];

  return {
    contentSecurityPolicy: {
      contentSecurityPolicy: `script-src '${loginCallbackInlineScriptHash}' https:;`,
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
};
