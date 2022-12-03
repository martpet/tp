import { OauthCookieProps } from '~/constructs/Api/types';

export const dummyOauthCookieProps: OauthCookieProps = {
  stateNonce: 'dummyState',
  idTokenNonce: 'dummyIdTokenNonce',
  codeVerifier: 'dummyCodeVerifier',
};

export const parseOauthCookie = vi
  .fn()
  .mockName('parseOauthCookie')
  .mockReturnValue(dummyOauthCookieProps);
