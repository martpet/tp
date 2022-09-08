import camelcaseKeys from 'camelcase-keys';
import fetch from 'node-fetch';

import { authPaths } from '~/consts';

import { FetchTokenResponse, IdTokenPayload, OauthTokens } from '../../../apiTypes';

type FetchTokensProps = {
  code: string;
  codeVerifier: string;
  clientId: string;
  authDomain: string;
  loginCallbackUrl: string;
};

export const fetchTokens = async ({
  code,
  codeVerifier,
  clientId,
  authDomain,
  loginCallbackUrl,
}: FetchTokensProps): Promise<OauthTokens> => {
  const response = await fetch(`https://${authDomain}${authPaths.token}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      code_verifier: codeVerifier,
      redirect_uri: loginCallbackUrl,
    }),
  });

  const tokens = (await response.json()) as FetchTokenResponse;

  const idTokenPayload = JSON.parse(
    Buffer.from(tokens.id_token.split('.')[1], 'base64').toString()
  ) as IdTokenPayload;

  return {
    ...camelcaseKeys(tokens),
    idTokenPayload,
  };
};
