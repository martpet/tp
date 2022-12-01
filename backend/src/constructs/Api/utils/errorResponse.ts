import { APIGatewayProxyResult } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { SetRequired } from 'type-fest';

import { ApiErrorResponseBody } from '~/types';

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

type ErrorResponseOptions = WithExposedError | WithoutExposedError;

export const errorResponse = (
  traceId: string,
  options: ErrorResponseOptions = {}
): APIGatewayProxyResult => {
  const {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    description,
    error,
    exposeError,
  } = options;

  const { envName } = globalLambdaProps;

  const errObj: ApiErrorResponseBody['error'] = {
    statusCode,
    message: getReasonPhrase(statusCode),
    traceId,
  };

  if (description) {
    errObj.description = description;
  }

  if (error && (exposeError ?? envName !== 'production')) {
    errObj.error = String(error);
  }

  const errorResponseBody: ApiErrorResponseBody = {
    error: errObj,
  };

  if (error) {
    console.error(traceId, error);
  } else {
    console.error(traceId);
  }

  return {
    statusCode,
    body: JSON.stringify(errorResponseBody),
  };
};
