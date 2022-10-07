import { HeadersReferrerPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';

import { Auth, Tables } from '~/constructs';
import { EndpointsOptions } from '~/constructs/Api/types';
import { appEnvs } from '~/consts';
import { getEnvName } from '~/utils';

import { createLoginCallbackScript } from './handlers/loginCallback/get-loginCallback/createLoginCallbackScript';

type EndpointsProps = {
  scope: Construct;
  auth: Auth;
  tables: Tables;
};

export const endpointsOptions = ({
  scope,
  tables,
  auth,
}: EndpointsProps): EndpointsOptions => {
  const { authDomain, loginCallbackUrl, logoutCallbackUrl, logoutCallbackLocalhostUrl } =
    auth;
  const clientId = auth.userPoolClient.userPoolClientId;
  const { sessionsTable } = tables;
  const envName = getEnvName(scope);
  const { appDomain } = appEnvs[envName];

  return {
    '/login': {
      cookies: ['oauth'],
      queryStrings: ['provider'],
      methods: {
        GET: {
          isPublic: true,
          environment: { authDomain, clientId, loginCallbackUrl },
        },
      },
    },

    '/loginCallback': {
      cookies: ['oauth'],
      queryStrings: ['code', 'state', 'error', 'error_description'],
      methods: {
        GET: {
          isPublic: true,
          environment: { authDomain, clientId, loginCallbackUrl },
          cb: (fn) => sessionsTable.grantWriteData(fn),
        },
      },
      securityHeadersBehavior: {
        contentSecurityPolicy: {
          contentSecurityPolicy: `script-src '${
            createLoginCallbackScript({
              envName,
              appDomain,
            }).cspHash
          }'`,
        },
      },
    },

    '/logout': {
      cookies: ['sessionId'],
      headers: ['referer'],
      methods: {
        GET: {
          isPublic: true,
          environment: {
            authDomain,
            clientId,
            logoutCallbackUrl,
            logoutCallbackLocalhostUrl,
          },
          cb: (fn) => sessionsTable.grantWriteData(fn),
        },
      },
      securityHeadersBehavior: {
        referrerPolicy: {
          referrerPolicy: HeadersReferrerPolicy.NO_REFERRER_WHEN_DOWNGRADE,
        },
      },
    },

    '/me': {
      methods: {
        GET: {},
      },
    },
  };
};
