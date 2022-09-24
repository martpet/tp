import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import cookie from 'cookie';
import { StatusCodes } from 'http-status-codes';

import { EventHeaders, ProcessEnv } from '~/constructs/Api/types';
import { cookieName, errorResponse, parseEventCookies } from '~/constructs/Api/utils';
import { authPaths, localhostUrl } from '~/consts';
import { EnvName } from '~/types';

import { deleteSession } from './deleteSession';
import { revokeOauthTokens } from './revokeOauthTokens';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { authDomain, clientId, logoutCallbackUrl, logoutCallbackLocalhostUrl, envName } =
    process.env as ProcessEnv<'/logout'>;

  const isPersonalEnv = (envName as EnvName) === 'personal';
  const { referer } = event.headers as EventHeaders<'/logout'>;
  const { sessionId } = parseEventCookies<'/logout'>(event);
  const isFromLocalhost = isPersonalEnv && referer?.startsWith(localhostUrl);
  const cognitoLogoutUrl = new URL(`https://${authDomain}${authPaths.logout}`);
  const blankSessionCookie = cookie.serialize(cookieName('sessionId'), '', {
    expires: new Date(),
  });

  if (
    !authDomain ||
    !clientId ||
    !logoutCallbackUrl ||
    !logoutCallbackLocalhostUrl ||
    !envName
  ) {
    return errorResponse('WKSoIIT1Ds');
  }

  if (isPersonalEnv && !referer) {
    return errorResponse('GkjK-mpVvL');
  }

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

  const cognitoLogoutUrlParams = new URLSearchParams({
    client_id: clientId,
    logout_uri: isFromLocalhost ? logoutCallbackLocalhostUrl : logoutCallbackUrl,
  });

  cognitoLogoutUrl.search = cognitoLogoutUrlParams.toString();

  return {
    statusCode: StatusCodes.MOVED_TEMPORARILY,
    headers: { location: cognitoLogoutUrl.href },
    cookies: [blankSessionCookie],
  };
};