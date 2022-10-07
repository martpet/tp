import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { OauthTokens, ProcessEnv, QueryStringParameters } from '~/constructs/Api/types';
import { errorResponse } from '~/constructs/Api/utils';
import { appEnvs } from '~/consts';

import { createLoginCallbackScript } from './createLoginCallbackScript';
import { createSession } from './createSession';
import { fetchTokens } from './fetchTokens';
import { parseOauthCookie } from './parseOauthCookie';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const { envName } = globalLambdaProps;
  const { appDomain } = appEnvs[envName];
  const { script: responseScript } = createLoginCallbackScript({ envName, appDomain });

  const {
    state,
    code,
    error: queryStringError,
    error_description: queryStringErrorDescrption,
  } = Object(event.queryStringParameters) as QueryStringParameters<'/loginCallback'>;

  const { clientId, authDomain, loginCallbackUrl } =
    process.env as ProcessEnv<'/loginCallback'>;

  const { stateNonce, idTokenNonce, codeVerifier } = parseOauthCookie(event);

  if (queryStringError) {
    return errorResponse('5vR4w3wVJs', {
      statusCode: StatusCodes.BAD_REQUEST,
      error: `${queryStringError}: ${queryStringErrorDescrption}`,
    });
  }

  if (!state || !code) {
    return errorResponse('1cByWITGGHw', { statusCode: StatusCodes.BAD_REQUEST });
  }

  if (!clientId || !authDomain || !loginCallbackUrl) {
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
    sessionCookie = await createSession({ tokens });
  } catch (error) {
    return errorResponse('h7UMnEUDvF', { error });
  }

  return {
    statusCode: StatusCodes.OK,
    cookies: [sessionCookie],
    headers: { 'Content-Type': 'text/html' },
    body: `<script>${responseScript}</script>`,
  };
};
