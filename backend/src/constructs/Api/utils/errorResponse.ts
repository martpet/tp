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
  exposeError: true;
};

type WithoutExposedError = BaseOptions & {
  exposeError?: never | false;
};

export const errorResponse = (
  traceId: string,
  {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    description,
    error,
    exposeError,
  }: ErrorResponseOptions = {}
): APIGatewayProxyResult => {
  const { cdkEnv } = globalLambda;
  const exposeErrorEnvs: EnvName[] = ['personal', 'staging'];

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

    if (exposeError ?? exposeErrorEnvs.includes(cdkEnv)) {
      bodyErrorObject.error = String(error);
    }
  }

  return {
    statusCode,
    body: JSON.stringify({ error: bodyErrorObject }),
  };
};
