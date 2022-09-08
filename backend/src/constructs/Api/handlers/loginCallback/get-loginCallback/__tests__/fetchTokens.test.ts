import camelcaseKeys from 'camelcase-keys';
import fetch, { Response } from 'node-fetch';

import { fetchTokens } from '../fetchTokens';

vi.mock('node-fetch');
vi.mock('camelcase-keys');

const idToken = '.eyJkdW1teV9pZHRva2VuX2tleSI6ImR5bW15X2lkdG9rZW5fdmFsIn0=.';

const args = [
  {
    code: 'dummyCode',
    codeVerifier: 'dummyCodeVerifier',
    clientId: 'dummyClientId',
    authDomain: 'dummyAuthDomain',
    loginCallbackUrl: 'dummyLoginCallbackUrl',
  },
] as const;

beforeEach(() => {
  vi.mocked(fetch).mockResolvedValue({
    json: () => Promise.resolve({ id_token: idToken }),
  } as Response);
});

describe('fetchTokens', () => {
  it('calls "fetch" with correct args', async () => {
    await fetchTokens(...args);
    expect(vi.mocked(fetch).mock.calls).toMatchSnapshot();
  });

  it('calls "camelcaseKeys" with correct args', async () => {
    await fetchTokens(...args);
    expect(vi.mocked(camelcaseKeys).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(fetchTokens(...args)).resolves.toMatchSnapshot();
  });
});
