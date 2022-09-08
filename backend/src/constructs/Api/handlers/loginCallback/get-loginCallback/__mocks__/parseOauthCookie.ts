import { OauthCookieProps } from '../../../../apiTypes';

export const dummyOauthCookieProps: OauthCookieProps = {
  stateNonce: 'dummyState',
  idTokenNonce: 'dummyIdTokenNonce',
  codeVerifier: 'dummyCodeVerifier',
};

export const parseOauthCookie = vi.fn().mockReturnValue(dummyOauthCookieProps);
