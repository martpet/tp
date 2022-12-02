import { itReturnsCorrectly } from '~/constructs/Api/utils';

import { getPublicEndpoints } from '../getPublicEndpoints';

const args = [
  {
    '/endpoint1': {
      methods: {
        GET: { isPublic: false },
        POST: { isPublic: true },
      },
    },
    '/endpoint2': {
      methods: {
        GET: {},
      },
    },
    '/endpoint3': {
      methods: {
        GET: { isPublic: true },
      },
    },
  },
] as unknown as Parameters<typeof getPublicEndpoints>;

describe('getPublicEndpoints', () => {
  itReturnsCorrectly(getPublicEndpoints, args);
});
