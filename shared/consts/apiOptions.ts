export const apiOptions = {
  '/login': {
    cookies: ['oauth'],
    queryStrings: ['provider'],
    envVars: ['authDomain', 'clientId', 'loginCallbackUrl'],
    methods: {
      GET: { isPublic: true },
    },
  },

  '/loginCallback': {
    cookies: ['oauth'],
    queryStrings: ['code', 'state', 'error', 'error_description'],
    envVars: ['authDomain', 'clientId', 'loginCallbackUrl'],
    methods: {
      GET: { isPublic: true },
    },
  },

  '/logout': {
    cookies: ['sessionId'],
    headers: ['referer'],
    methods: {
      GET: { isPublic: true },
    },
    envVars: [
      'authDomain',
      'clientId',
      'logoutCallbackUrl',
      'logoutCallbackLocalhostUrl',
    ],
  },

  '/me': {
    methods: {
      GET: {},
    },
  },
} as const; // todo: use "as const satisfies ApiOptions" (typescript 4.9)
