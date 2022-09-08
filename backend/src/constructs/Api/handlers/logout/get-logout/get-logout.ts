import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import cookie from 'cookie';
import { StatusCodes } from 'http-status-codes';

import { authPaths, localhostUrl } from '~/consts';
import { EnvName } from '~/types';

import { ProcessEnv, RequestHeaders } from '../../../apiTypes';
import { cookieName, errorResponse } from '../../../apiUtils';
import { deleteSession } from './deleteSession';
import { parseSessionCookie } from './parseSessionCookie';
import { revokeOauthTokens } from './revokeOauthTokens';

export const handler: APIGatewayProxyHandlerV2 = async ({ cookies, headers }) => {
  const { authDomain, clientId, logoutCallbackUrl, logoutCallbackLocalhostUrl, envName } =
    process.env as ProcessEnv<'/logout'>;

  const { referer } = headers as RequestHeaders<'/logout'>;

  if (
    !authDomain ||
    !clientId ||
    !logoutCallbackUrl ||
    !logoutCallbackLocalhostUrl ||
    !envName
  ) {
    return errorResponse('WKSoIIT1Ds');
  }

  const isPersonalEnv = (envName as EnvName) === 'personal';
  const isFromLocalhost = isPersonalEnv && referer?.startsWith(localhostUrl);

  if (isPersonalEnv && !referer) {
    return errorResponse('GkjK-mpVvL');
  }

  const sessionId = parseSessionCookie(cookies);

  if (sessionId) {
    let refreshToken: string;

    try {
      refreshToken = await deleteSession(sessionId);
    } catch (error) {
      return errorResponse('If_8Sr_Y7L', { error });
    }

    try {
      await revokeOauthTokens({ authDomain, clientId, refreshToken });
    } catch (error) {
      return errorResponse('-8-K2WmZuo', { error });
    }
  }

  const cognitoLogoutUrl = new URL(`https://${authDomain}${authPaths.logout}`);

  const cognitoLogoutUrlParams = new URLSearchParams({
    client_id: clientId,
    logout_uri: isFromLocalhost ? logoutCallbackLocalhostUrl : logoutCallbackUrl,
  });

  cognitoLogoutUrl.search = cognitoLogoutUrlParams.toString();

  const blankSessionCookie = cookie.serialize(cookieName('session'), '', {
    expires: new Date(),
  });

  return {
    statusCode: StatusCodes.MOVED_TEMPORARILY,
    headers: { location: cognitoLogoutUrl.href },
    cookies: [blankSessionCookie],
  };
};
