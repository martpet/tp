import fetch, { Response } from 'node-fetch';

import { revokeOauthTokens } from '../revokeOauthTokens';

vi.mock('node-fetch');

const args = [
  {
    authDomain: 'dummyAuthDomain',
    refreshToken: 'dummyRefreshToken',
    clientId: 'dummyClientId',
  },
] as const;

beforeEach(() => {
  vi.mocked(fetch).mockResolvedValue({ ok: true } as Response);
});

describe('revokeOauthTokens', () => {
  it('calls "fetch" with correct args', async () => {
    await revokeOauthTokens(...args);
    expect(vi.mocked(fetch).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(revokeOauthTokens(...args)).resolves.toMatchSnapshot();
  });

  describe('when "fetch" response is not "ok"', () => {
    beforeEach(() => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('dummyFetchResponseText'),
      } as Response);
    });

    it('rejects with a correct value', () => {
      return expect(revokeOauthTokens(...args)).rejects.toMatchSnapshot();
    });
  });
});
