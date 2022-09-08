import { Auth, Tables } from '~/constructs';
import { EnvName } from '~/types';

import { EndpointsOptions } from './apiTypes/EndpointsOptions';

type EndpointsOptionsProps = {
  auth: Auth;
  tables: Tables;
  envName: EnvName;
};

export const endpointsOptions = ({
  tables,
  auth,
  envName,
}: EndpointsOptionsProps): EndpointsOptions => {
  const { authDomain, loginCallbackUrl, logoutCallbackUrl, logoutCallbackLocalhostUrl } =
    auth;
  const clientId = auth.userPoolClient.userPoolClientId;
  const { sessionsTable } = tables;

  return {
    '/login': {
      cookies: ['oauth'],
      queryStrings: ['provider'],
      methods: {
        GET: {
          environment: { authDomain, clientId, loginCallbackUrl },
        },
      },
    },

    '/loginCallback': {
      cookies: ['oauth'],
      queryStrings: ['code', 'state'],
      methods: {
        GET: {
          environment: { authDomain, clientId, loginCallbackUrl, envName },
          cb: (handler) => sessionsTable.grantWriteData(handler),
        },
      },
    },

    '/logout': {
      cookies: ['session'],
      headers: ['referer'],
      methods: {
        GET: {
          environment: {
            authDomain,
            clientId,
            logoutCallbackUrl,
            logoutCallbackLocalhostUrl,
            envName,
          },
          cb: (handler) => sessionsTable.grantWriteData(handler),
        },
      },
    },
  };
};
