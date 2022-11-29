import fetch, { Response } from 'node-fetch';

import { itRejects } from '~/constructs/Api/utils';

import { fetchNewIdToken } from '../fetchNewIdToken';
import { updateSession } from '../updateSession';

vi.mock('node-fetch');
vi.mock('../updateSession');

const args = [
  {
    refreshToken: 'dummyRefreshToken',
    sessionId: 'dummySessionId',
    clientId: 'dummyClientId',
  },
] as Parameters<typeof fetchNewIdToken>;

vi.mocked(fetch).mockResolvedValue({
  json: () => Promise.resolve({ id_token: 'dummyIdToken' }),
} as Response);

global.globalAuthEdgeFunctionProps = {
  authDomain: 'dummyAuthDomain',
} as typeof globalAuthEdgeFunctionProps;

describe('fetchNewIdToken', () => {
  it('calls "fetch" with correct args', async () => {
    await fetchNewIdToken(...args);
    expect(vi.mocked(fetch).mock.calls).toMatchSnapshot();
  });

  it('calls "updateSession" with correct args', async () => {
    await fetchNewIdToken(...args);
    expect(vi.mocked(updateSession).mock.calls).toMatchSnapshot();
  });

  it('returns a correct value', () => {
    return expect(fetchNewIdToken(...args)).resolves.toMatchSnapshot();
  });

  describe('when "fetch" response contains an "error" prop', () => {
    beforeEach(() => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: () => Promise.resolve({ error: 'dummyErrorMessage' }),
      } as Response);
    });
    itRejects(fetchNewIdToken, args);
  });
});
