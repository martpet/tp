import { ApiOptions } from '../types/ApiOptions';

export const apiOptions = {
  '/login': {
    methods: {
      GET: {
        isPublic: true,
        envVars: ['authDomain', 'clientId', 'loginCallbackUrl'],
      },
    },
    cookies: ['oauth'],
    queryStrings: ['provider'],
  },

  '/login-callback': {
    methods: {
      GET: {
        isPublic: true,
        envVars: ['authDomain', 'clientId', 'loginCallbackUrl'],
      },
    },
    cookies: ['oauth'],
    queryStrings: ['code', 'state', 'error', 'error_description'],
  },

  '/logout': {
    methods: {
      GET: {
        isPublic: true,
        envVars: [
          'authDomain',
          'clientId',
          'logoutCallbackUrl',
          'logoutCallbackLocalhostUrl',
        ],
      },
    },
    cookies: ['sessionId'],
    headers: ['referer'],
  },

  '/me': {
    methods: {
      GET: {},
    },
  },

  '/settings': {
    methods: {
      PATCH: {},
    },
  },
  '/upload-urls': {
    methods: {
      POST: {
        envVars: ['photoBucket'],
      },
    },
  },
  '/photos': {
    methods: {
      POST: {},
    },
  },
} as const satisfies ApiOptions;
