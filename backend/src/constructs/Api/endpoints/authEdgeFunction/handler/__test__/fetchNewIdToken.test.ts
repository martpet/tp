import fetch, { Response } from 'node-fetch';

import { itCalls, itRejects, itResolves } from '~/constructs/Api/utils';

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
  itCalls(fetch, fetchNewIdToken, args);
  itCalls(updateSession, fetchNewIdToken, args);

  describe('when "fetch" response contains an "error" prop', () => {
    beforeEach(() => {
      const error = { error: 'dummyErrorMessage' };
      const response = { json: () => Promise.resolve(error) } as Response;
      vi.mocked(fetch).mockResolvedValueOnce(response);
    });
    itRejects(fetchNewIdToken, args);
  });
});
