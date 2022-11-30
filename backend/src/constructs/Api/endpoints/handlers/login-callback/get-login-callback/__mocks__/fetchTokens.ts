import { IdTokenPayload, OauthTokens } from '~/constructs/Api/types';

export const dummyOauthTokens: OauthTokens = {
  accessToken: 'dummyAccessToken',
  refreshToken: 'dummyRefreshToken',
  idToken: 'dummyIdToken',
  expiresIn: 123,
  idTokenPayload: {
    sub: 'dummySub',
    nonce: 'dummyIdTokenNonce',
    aud: 'dummyAud',
  } as IdTokenPayload,
};

export const fetchTokens = vi.fn().mockResolvedValue(dummyOauthTokens);
