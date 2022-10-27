import { APIGatewayProxyResult } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { SetRequired } from 'type-fest';

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
  const { envName } = globalLambdaProps;

  const errorObj: Record<string, unknown> = {
    statusCode,
    message: getReasonPhrase(statusCode),
    traceId,
  };

  if (description) {
    errorObj.description = description;
  }

  if (error) {
    console.error(`[${traceId}]`, error);

    if (exposeError ?? envName !== 'production') {
      errorObj.error = String(error);
    }
  }

  return {
    statusCode,
    body: JSON.stringify({ error: errorObj }),
  };
};
