import crypto from 'crypto';

import { itResolves } from '~/constructs/Api/utils';
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
  it('calls "getRandomBase64UrlSafe" 3 times with correct values', async () => {
    await generateOauthRandoms();
    expect(vi.mocked(getRandomBase64UrlSafe).mock.calls).toMatchSnapshot();
  });

  it('calls "createHash" with a correct value', async () => {
    await generateOauthRandoms();
    expect(vi.mocked(crypto.createHash).mock.calls).toMatchSnapshot();
  });

  it('calls "update" on the return value of "createHash" with a correct value', async () => {
    await generateOauthRandoms();
    expect(vi.mocked(crypto.createHash('').update).mock.calls).toMatchSnapshot();
  });

  it('calls "digest" on the return value of "update" with a correct value', async () => {
    await generateOauthRandoms();
    expect(
      vi.mocked(crypto.createHash('').update('').digest).mock.calls
    ).toMatchSnapshot();
  });

  itResolves(generateOauthRandoms);
});
