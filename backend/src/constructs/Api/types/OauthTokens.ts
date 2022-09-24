import { CamelCaseKeys } from 'camelcase-keys';

export type FetchTokensResponse = FetchTokensResponseData | FetchTokensErrorResponseData;

export type FetchNewIdTokenResponse =
  | Pick<FetchTokensResponseData, 'id_token'>
  | FetchTokensErrorResponseData;

export type FetchTokensResponseData = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
};

export type FetchTokensErrorResponseData = {
  error: string;
};

export type OauthTokens = CamelCaseKeys<FetchTokensResponseData> & {
  idTokenPayload: IdTokenPayload;
};

export type IdTokenPayload = {
  nonce: string;
  atHash: string;
  sub: string;
  'cognito:groups': string[];
  emailVerified: false;
  iss: string;
  'cognito:username': string;
  givenName: string;
  picture: string;
  originJti: string;
  aud: string;
  identities: [
    {
      userId: string;
      providerName: string;
      providerType: string;
      issuer: null;
      primary: string;
      dateCreated: string;
    }
  ];
  tokenUse: 'id';
  authTime: number;
  exp: number;
  iat: number;
  familyName: string;
  jti: string;
  email: string;
};
