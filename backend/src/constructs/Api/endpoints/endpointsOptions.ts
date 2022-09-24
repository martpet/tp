import { Auth, Tables } from '~/constructs';
import { EndpointsOptions } from '~/constructs/Api/types';
import { EnvName } from '~/types';

type EndpointsProps = {
  auth: Auth;
  tables: Tables;
  envName: EnvName;
};

export const endpointsOptions = ({
  tables,
  auth,
  envName,
}: EndpointsProps): EndpointsOptions => {
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
          isPublic: true,
          environment: { authDomain, clientId, loginCallbackUrl },
        },
      },
    },

    '/loginCallback': {
      cookies: ['oauth'],
      queryStrings: ['code', 'state'],
      methods: {
        GET: {
          isPublic: true,
          environment: { authDomain, clientId, loginCallbackUrl, envName },
          cb: (fn) => sessionsTable.grantWriteData(fn),
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
            envName,
          },
          cb: (fn) => sessionsTable.grantWriteData(fn),
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
