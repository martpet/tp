import { CamelCaseKeys } from 'camelcase-keys';

export type OauthTokens = CamelCaseKeys<FetchTokenResponse> & {
  idTokenPayload: IdTokenPayload;
};

export type FetchTokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
};

export type IdTokenPayload = {
  sub: string;
  nonce: string;
};
