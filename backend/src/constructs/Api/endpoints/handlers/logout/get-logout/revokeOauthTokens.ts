import fetch from 'node-fetch';

import { authPaths } from '~/consts';

type RevokeTokensProps = {
  authDomain: string;
  refreshToken: string;
  clientId: string;
};

export const revokeOauthTokens = async ({
  authDomain,
  refreshToken,
  clientId,
}: RevokeTokensProps) => {
  const response = await fetch(`https://${authDomain}${authPaths.revoke}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      token: refreshToken,
      client_id: clientId,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText);
  }
};
