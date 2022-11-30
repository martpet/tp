import { Duration } from 'aws-cdk-lib';
import {
  HeadersFrameOption,
  HeadersReferrerPolicy,
  ResponseSecurityHeadersBehavior,
} from 'aws-cdk-lib/aws-cloudfront';
import deepmerge from 'deepmerge';
import { PartialDeep } from 'type-fest';

import { ApiPath, EnvName } from '~/types';

import { createLoginCallbackScript } from './handlers/login-callback/get-login-callback/createLoginCallbackScript';

const defaultSecurityHeadersBehavior: ResponseSecurityHeadersBehavior = {
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

type Props = {
  envName: EnvName;
  appDomain: string;
  path: ApiPath;
};

export const getSecurityHeadersBehavior = ({ envName, appDomain, path }: Props) => {
  const customSecurityHeadersBehaviors: Partial<
    Record<ApiPath, PartialDeep<ResponseSecurityHeadersBehavior>>
  > = {
    '/login-callback': {
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

  return deepmerge(
    defaultSecurityHeadersBehavior,
    customSecurityHeadersBehaviors[path] || {},
    { clone: false }
  ) as ResponseSecurityHeadersBehavior;
};
