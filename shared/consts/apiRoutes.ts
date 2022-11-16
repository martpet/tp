export const apiRoutes = {
  '/login': {
    methods: {
      GET: { isPublic: true },
    },
    cookies: ['oauth'],
    queryStrings: ['provider'],
    envVars: ['authDomain', 'clientId', 'loginCallbackUrl'],
  },

  '/loginCallback': {
    methods: {
      GET: { isPublic: true },
    },
    cookies: ['oauth'],
    queryStrings: ['code', 'state', 'error', 'error_description'],
    envVars: ['authDomain', 'clientId', 'loginCallbackUrl'],
  },

  '/logout': {
    methods: {
      GET: { isPublic: true },
    },
    cookies: ['sessionId'],
    headers: ['referer'],
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

  '/settings': {
    methods: {
      PATCH: {},
    },
  },
  '/generate-upload-urls': {
    methods: {
      POST: {},
    },
  },
} as const; // todo: use "as const satisfies ApiRoutes" (typescript 4.9)
