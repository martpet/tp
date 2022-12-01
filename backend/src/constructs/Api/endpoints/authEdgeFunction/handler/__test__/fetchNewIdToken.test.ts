import fetch, { Response } from 'node-fetch';

import { itRejects, itResolves } from '~/constructs/Api/utils';

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
  itResolves(fetchNewIdToken, args);

  it('calls "fetch" with correct args', async () => {
    await fetchNewIdToken(...args);
    expect(vi.mocked(fetch).mock.calls).toMatchSnapshot();
  });

  it('calls "updateSession" with correct args', async () => {
    await fetchNewIdToken(...args);
    expect(vi.mocked(updateSession).mock.calls).toMatchSnapshot();
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
