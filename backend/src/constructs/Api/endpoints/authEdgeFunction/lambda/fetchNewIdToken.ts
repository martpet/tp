import fetch from 'node-fetch';

import { FetchNewIdTokenResponse } from '~/constructs/Api/types';
import { authPaths } from '~/consts';

import { updateSession } from './updateSession';

type FetchNewIdTokenProps = {
  refreshToken: string;
  sessionId: string;
  clientId: string;
};

export const fetchNewIdToken = async ({
  refreshToken,
  sessionId,
  clientId,
}: FetchNewIdTokenProps) => {
  const { authDomain } = globalAuthEdgeFunctionProps;

  console.info('Fetching new id token...');

  const response = await fetch(`https://${authDomain}${authPaths.token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    }),
  });

  const data = (await response.json()) as FetchNewIdTokenResponse;

  if ('error' in data) {
    throw new Error(data.error);
  }

  await updateSession({ sessionId, idToken: data.id_token });

  console.info('New id token fetched and saved');

  return data.id_token;
};
