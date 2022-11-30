import camelcaseKeys from 'camelcase-keys';
import {
  authPaths,
  FetchTokensResponse,
  getIdTokenPayload,
  OauthTokens,
} from 'lambda-layer';
import fetch from 'node-fetch';

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
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      code_verifier: codeVerifier,
      redirect_uri: loginCallbackUrl,
    }),
  });

  const data = (await response.json()) as FetchTokensResponse;

  if ('error' in data) {
    throw new Error(data.error);
  }

  return {
    ...camelcaseKeys(data),
    idTokenPayload: await getIdTokenPayload(data.id_token),
  };
};
