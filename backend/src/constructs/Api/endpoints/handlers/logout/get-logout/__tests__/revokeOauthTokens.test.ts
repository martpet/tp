import fetch, { Response } from 'node-fetch';

import { itRejectsCorrectly, itResolvesCorrectly } from '~/constructs/Api/utils';

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
  itResolvesCorrectly(revokeOauthTokens, args);

  it('calls "fetch" with correct args', async () => {
    await revokeOauthTokens(...args);
    expect(vi.mocked(fetch).mock.calls).toMatchSnapshot();
  });

  describe('when "fetch" response is not "ok"', () => {
    beforeEach(() => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('dummyFetchResponseText'),
      } as Response);
    });
    itRejectsCorrectly(revokeOauthTokens, args);
  });
});
