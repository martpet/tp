import camelcaseKeys from 'camelcase-keys';
import fetch, { Response } from 'node-fetch';

import { getIdTokenPayload } from '~/constructs/Api/utils';

import { fetchTokens } from '../fetchTokens';

vi.mock('node-fetch');
vi.mock('camelcase-keys');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');

const args = [
  {
    code: 'dummyCode',
    codeVerifier: 'dummyCodeVerifier',
    clientId: 'dummyClientId',
    authDomain: 'dummyAuthDomain',
    loginCallbackUrl: 'dummyLoginCallbackUrl',
  },
] as const;

vi.mocked(fetch).mockResolvedValue({
  json: () => Promise.resolve({ id_token: 'dummyIdToken' }),
} as Response);

describe('fetchTokens', () => {
  it('calls "fetch" with correct args', async () => {
    await fetchTokens(...args);
    expect(vi.mocked(fetch).mock.calls).toMatchSnapshot();
  });

  it('calls "camelcaseKeys" with correct args', async () => {
    await fetchTokens(...args);
    expect(vi.mocked(camelcaseKeys).mock.calls).toMatchSnapshot();
  });

  it('calls "getIdTokenPayload" with correct args', async () => {
    await fetchTokens(...args);
    expect(vi.mocked(getIdTokenPayload).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(fetchTokens(...args)).resolves.toMatchSnapshot();
  });

  describe('when "fetch" response contains an "error" prop', () => {
    beforeEach(() => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: () => Promise.resolve({ error: 'dummyErrorMessage' }),
      } as Response);
    });

    it('rejects with a correct value', () => {
      expect(fetchTokens(...args)).rejects.toMatchSnapshot();
    });
  });
});
