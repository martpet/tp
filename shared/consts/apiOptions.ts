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

  '/loginCallback': {
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
  '/generate-upload-urls': {
    methods: {
      POST: {
        envVars: ['photosBucket'],
      },
    },
  },
} as const; // todo: use "as const satisfies ApiOptions" (typescript 4.9)
