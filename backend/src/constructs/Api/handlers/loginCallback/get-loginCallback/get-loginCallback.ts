import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { loginPopupSuccessMessage } from '~/consts';

import { OauthTokens, ProcessEnv, QueryStringParameters } from '../../../apiTypes';
import { errorResponse } from '../../../apiUtils';
import { createSession } from './createSession';
import { fetchTokens } from './fetchTokens';
import { parseOauthCookie } from './parseOauthCookie';

export const handler: APIGatewayProxyHandlerV2 = async ({
  queryStringParameters,
  cookies,
}) => {
  const { state, code } = Object(
    queryStringParameters
  ) as QueryStringParameters<'/loginCallback'>;

  const { clientId, authDomain, loginCallbackUrl, envName } =
    process.env as ProcessEnv<'/loginCallback'>;

  const { stateNonce, idTokenNonce, codeVerifier } = parseOauthCookie(cookies);

  if (!state || !code) {
    return errorResponse('1cByWITGGHw', { statusCode: StatusCodes.BAD_REQUEST });
  }

  if (!clientId || !authDomain || !loginCallbackUrl || !envName) {
    return errorResponse('XuJRO7_43O');
  }

  if (!stateNonce || !idTokenNonce || !codeVerifier) {
    return errorResponse('OSUiwUI_DG');
  }

  if (state !== stateNonce) {
    return errorResponse('eWe87M5edc', { statusCode: StatusCodes.UNAUTHORIZED });
  }

  let tokens: OauthTokens;
  let sessionCookie: string;

  try {
    tokens = await fetchTokens({
      code,
      codeVerifier,
      clientId,
      authDomain,
      loginCallbackUrl,
    });
  } catch (error) {
    return errorResponse('-glnzeksvh', { error });
  }

  if (tokens.idTokenPayload.nonce !== idTokenNonce) {
    return errorResponse('C25fjaal7o', { statusCode: StatusCodes.UNAUTHORIZED });
  }

  try {
    sessionCookie = await createSession({ tokens, envName });
  } catch (error) {
    return errorResponse('h7UMnEUDvF', { error });
  }

  return {
    statusCode: StatusCodes.OK,
    cookies: [sessionCookie],
    headers: { 'Content-Type': 'text/html' },
    body: `<script>opener.postMessage("${loginPopupSuccessMessage}", "*")</script>`,
  };
};
