import { APIGatewayProxyResult } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { SetRequired } from 'type-fest';

import { EnvName } from '~/types';

type ErrorResponseOptions = WithExposedError | WithoutExposedError;

type BaseOptions = {
  description?: string;
  error?: unknown;
  statusCode?: StatusCodes;
};

type WithExposedError = SetRequired<BaseOptions, 'error'> & {
  exposeErrorMessage: true;
};

type WithoutExposedError = BaseOptions & {
  exposeErrorMessage?: never | false;
};

const exposeErrorEnvs: EnvName[] = ['personal', 'staging'];

export const errorResponse = (
  traceId: string,
  {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    description,
    error,
    exposeErrorMessage = exposeErrorEnvs.includes(global.cdkContextEnv),
  }: ErrorResponseOptions = {}
): APIGatewayProxyResult => {
  const bodyErrorObject: Record<string, unknown> = {
    statusCode,
    message: getReasonPhrase(statusCode),
    traceId,
  };

  if (description) {
    bodyErrorObject.description = description;
  }

  if (error instanceof Error) {
    console.error(`[${traceId}]`, error);

    if (exposeErrorMessage) {
      bodyErrorObject.error = String(error);
    }
  }

  return {
    statusCode,
    body: JSON.stringify({ error: bodyErrorObject }),
  };
};
