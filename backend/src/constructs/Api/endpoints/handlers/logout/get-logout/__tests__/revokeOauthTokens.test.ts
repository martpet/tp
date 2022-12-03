import fetch, { Response } from 'node-fetch';

import { itCalls, itRejects, itResolves } from '~/constructs/Api/utils';

import { revokeOauthTokens } from '../revokeOauthTokens';

vi.mock('node-fetch');

const args = [
  {
    authDomain: 'dummyAuthDomain',
    refreshToken: 'dummyRefreshToken',
    clientId: 'dummyClientId',
  },
] as Parameters<typeof revokeOauthTokens>;

beforeEach(() => {
  vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
});

describe('revokeOauthTokens', () => {
  itCalls(fetch, revokeOauthTokens, args);
  itResolves(revokeOauthTokens, args);

  describe('when "fetch" response is not "ok"', () => {
    beforeEach(() => {
      const response = {
        ok: false,
        text: () => Promise.resolve('dummyFetchResponseText'),
      } as Response;
      vi.mocked(fetch).mockResolvedValue(response);
    });
    itRejects(revokeOauthTokens, args);
  });
});
