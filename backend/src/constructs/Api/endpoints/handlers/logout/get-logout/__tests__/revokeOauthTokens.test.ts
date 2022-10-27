import fetch, { Response } from 'node-fetch';

import { itRejects, itResolves } from '~/constructs/Api/utils';

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
  it('calls "fetch" with correct args', async () => {
    await revokeOauthTokens(...args);
    expect(vi.mocked(fetch).mock.calls).toMatchSnapshot();
  });

  itResolves(revokeOauthTokens, args);

  describe('when "fetch" response is not "ok"', () => {
    beforeEach(() => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('dummyFetchResponseText'),
      } as Response);
    });

    itRejects(revokeOauthTokens, args);
  });
});
