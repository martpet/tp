import {
  APIGatewayProxyHandlerV2,
  ApiRouteHeaders,
  authPaths,
  cookie,
  cookieName,
  errorResponse,
  HandlerEnv,
  localhostUrl,
  parseEventCookies,
  StatusCodes,
} from 'lambda-layer';

import { deleteSession } from './deleteSession';
import { revokeOauthTokens } from './revokeOauthTokens';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { envName } = globalLambdaProps;
  const { authDomain, clientId, logoutCallbackUrl, logoutCallbackLocalhostUrl } =
    process.env as HandlerEnv<'/logout', 'GET'>;
  const { referer } = event.headers as ApiRouteHeaders<'/logout'>;
  const { sessionId } = parseEventCookies<'/logout'>(event);
  const isFromLocalhost = envName === 'personal' && referer?.startsWith(localhostUrl);
  const cognitoLogoutUrl = new URL(`https://${authDomain}${authPaths.logout}`);
  const blankSessionCookie = cookie.serialize(cookieName('sessionId'), '', {
    expires: new Date(),
  });

  if (!authDomain || !clientId || !logoutCallbackUrl || !logoutCallbackLocalhostUrl) {
    return errorResponse('WKSoIIT1Ds');
  }

  if (envName === 'personal' && !referer) {
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
