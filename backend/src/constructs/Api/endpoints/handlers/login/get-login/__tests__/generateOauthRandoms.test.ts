import crypto from 'crypto';

import { itCalls, itResolves } from '~/constructs/Api/utils';
import { getRandomBase64UrlSafe } from '~/utils';

import { generateOauthRandoms } from '../generateOauthRandoms';

vi.mock('crypto');
vi.mock('~/utils/getRandomBase64UrlSafe');

beforeEach(() => {
  vi.mocked(getRandomBase64UrlSafe)
    .mockResolvedValueOnce('dummyIdTokenNonce')
    .mockResolvedValueOnce('dummyStateNonce')
    .mockResolvedValueOnce('dummyCodeVerifier');
});

describe('generateOauthRandoms', () => {
  itResolves(generateOauthRandoms);
  itCalls(getRandomBase64UrlSafe, generateOauthRandoms);
  itCalls(crypto.createHash, generateOauthRandoms);
  itCalls(crypto.createHash('').update, generateOauthRandoms);
  itCalls(crypto.createHash('').update('').digest, generateOauthRandoms);
});
