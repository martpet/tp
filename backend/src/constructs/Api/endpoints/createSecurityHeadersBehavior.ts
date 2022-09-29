import { Duration } from 'aws-cdk-lib';
import {
  HeadersFrameOption,
  HeadersReferrerPolicy,
  ResponseSecurityHeadersBehavior,
} from 'aws-cdk-lib/aws-cloudfront';

import { createLoginCallbackScript } from '~/constructs/Api/endpoints/handlers/loginCallback/get-loginCallback/createLoginCallbackScript';
import { appEnvs } from '~/consts';
import { ApiPath, EnvName } from '~/types';

type CreateSecurityHeadersBehaviorProps = {
  envName: EnvName;
  path: ApiPath;
};

export const createSecurityHeadersBehavior = ({
  envName,
  path,
}: CreateSecurityHeadersBehaviorProps): ResponseSecurityHeadersBehavior => {
  const { appDomain } = appEnvs[envName];
  const inlneScriptsHashes: string[] = [];

  if (path === '/loginCallback') {
    const { cspHash } = createLoginCallbackScript({ envName, appDomain });
    inlneScriptsHashes.push(cspHash);
  }

  const scriptsCspHashesString = inlneScriptsHashes.map((hash) => `'${hash}'`).join(' ');

  return {
    contentSecurityPolicy: {
      contentSecurityPolicy: `script-src ${scriptsCspHashesString} https:;`,
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
      override: true,
      // reportUri: 'https://example.com/csp-report',
    },
  };
};
