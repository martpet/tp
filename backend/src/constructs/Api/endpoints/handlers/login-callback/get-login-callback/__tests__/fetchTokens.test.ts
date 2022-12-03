import camelcaseKeys from 'camelcase-keys';
import fetch, { Response } from 'node-fetch';

import {
  getIdTokenPayload,
  itCalls,
  itRejects,
  itResolves,
} from '~/constructs/Api/utils';

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
] as unknown as Parameters<typeof fetchTokens>;

vi.mocked(fetch).mockResolvedValue({
  json: () => Promise.resolve({ id_token: 'dummyIdToken' }),
} as Response);

describe('fetchTokens', () => {
  itCalls(fetch, fetchTokens, args);
  itCalls(camelcaseKeys, fetchTokens, args);
  itCalls(getIdTokenPayload, fetchTokens, args);
  itResolves(fetchTokens, args);

  describe('when "fetch" response contains an "error" prop', () => {
    const error = { error: 'dummyErrorMessage' };
    const response = { json: () => Promise.resolve(error) } as Response;
    beforeEach(() => {
      vi.mocked(fetch).mockResolvedValueOnce(response);
    });
    itRejects(fetchTokens, args);
  });
});
