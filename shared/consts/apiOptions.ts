import type { ApiOptions } from '../types/ApiOptions';

export const apiOptions = {
  '/login': {
    cookies: ['oauth'],
    queryStrings: ['provider'],
    methods: {
      GET: {
        isPublic: true,
        envVars: ['authDomain', 'clientId', 'loginCallbackUrl'],
      },
    },
  },

  '/login-callback': {
    cookies: ['oauth'],
    queryStrings: ['code', 'state', 'error', 'error_description'],
    methods: {
      GET: {
        isPublic: true,
        envVars: ['authDomain', 'clientId', 'loginCallbackUrl'],
      },
    },
  },

  '/logout': {
    cookies: ['sessionId'],
    headers: ['referer'],
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
      GET: {
        isPublic: true,
        pathParam: 'fingerprint',
      },
      POST: {},
    },
  },
  '/images': {
    queryStrings: ['fingerprint', 'quality', 'size'],
    cacheProps: {
      maxTtl: 100 * 365 * 24 * 60 * 60,
    },
    methods: {
      GET: {
        isPublic: true,
        envVars: ['photoBucket'],
        nodejsFunctionProps: {
          memorySize: 512,
          bundling: {
            forceDockerBundling: true,
            nodeModules: ['sharp'],
          },
        },
      },
    },
  },
} as const satisfies ApiOptions;
