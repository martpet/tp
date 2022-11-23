import { APIGatewayProxyResult } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { SetRequired } from 'type-fest';

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
  {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    description,
    error,
    exposeError,
  }: ErrorResponseOptions = {}
): APIGatewayProxyResult => {
  const { envName } = globalLambdaProps;

  const errorObject: Record<string, unknown> = {
    statusCode,
    traceId,
    message: getReasonPhrase(statusCode),
  };

  if (description) {
    errorObject.description = description;
  }

  if (error) {
    console.error(`[${traceId}]`, error);

    if (exposeError ?? envName !== 'production') {
      errorObject.error = String(error);
    }
  }

  return {
    statusCode,
    body: JSON.stringify({ error: errorObject }),
  };
};
