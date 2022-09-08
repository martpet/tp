import { OauthTokens } from '../../../../apiTypes';

export const dummyOauthTokens: OauthTokens = {
  accessToken: 'dummyAccessToken',
  refreshToken: 'dummyRefreshToken',
  idToken: 'dummyIdToken',
  expiresIn: 123,
  idTokenPayload: {
    sub: 'dummySub',
    nonce: 'dummyIdTokenNonce',
  },
};

export const fetchTokens = vi.fn().mockResolvedValue(dummyOauthTokens);
