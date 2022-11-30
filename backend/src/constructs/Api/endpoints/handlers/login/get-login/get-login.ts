import {
  APIGatewayProxyHandlerV2,
  apiPaths,
  ApiRouteQueryStrings,
  authPaths,
  cookie,
  cookieName,
  errorResponse,
  HandlerEnv,
  OauthCookieProps,
  StatusCodes,
} from 'lambda-layer';

import { generateOauthRandoms } from './generateOauthRandoms';

export const handler: APIGatewayProxyHandlerV2 = async ({ queryStringParameters }) => {
  const { clientId, authDomain, loginCallbackUrl } = process.env as HandlerEnv<
    '/login',
    'GET'
  >;

  const { provider } = Object(queryStringParameters) as ApiRouteQueryStrings<'/login'>;

  if (!clientId || !authDomain || !loginCallbackUrl) {
    return errorResponse('1rQkj3kpp4');
  }

  if (!provider) {
    return errorResponse('6gUyCQQT7Z', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const { idTokenNonce, stateNonce, codeChallenge, codeVerifier } =
    await generateOauthRandoms();

  const cognitoAuthUrl = new URL(`https://${authDomain}${authPaths.authorize}`);

  const cognitoAuthUrlParams = new URLSearchParams({
    identity_provider: provider,
    client_id: clientId,
    redirect_uri: loginCallbackUrl,
    response_type: 'code',
    state: stateNonce,
    nonce: idTokenNonce,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  cognitoAuthUrl.search = cognitoAuthUrlParams.toString();

  const oauthCookieProps: OauthCookieProps = {
    stateNonce,
    idTokenNonce,
    codeVerifier,
  };

  const oauthCookie = cookie.serialize(
    cookieName('oauth'),
    JSON.stringify(oauthCookieProps),
    {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: apiPaths['login-callback'],
    }
  );

  return {
    statusCode: StatusCodes.MOVED_TEMPORARILY,
    headers: { location: cognitoAuthUrl.href },
    cookies: [oauthCookie],
  };
};
