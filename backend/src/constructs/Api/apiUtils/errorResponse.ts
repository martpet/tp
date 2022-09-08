import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { SetRequired } from 'type-fest';

type Options = WithExposedError | WithoutExposedError;

type Base = {
  description?: string;
  error?: unknown;
  statusCode?: StatusCodes;
};

type WithExposedError = SetRequired<Base, 'error'> & {
  expose: true;
};

type WithoutExposedError = Base & {
  expose?: never | false;
};

export const errorResponse = (
  traceId: string,
  {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    description,
    error,
    expose,
  }: Options = {}
) => {
  const responseErrrorObject: Record<string, unknown> = {
    statusCode,
    message: getReasonPhrase(statusCode),
    trace_id: traceId,
  };

  if (description) {
    responseErrrorObject.description = description;
  }

  if (error instanceof Error) {
    console.error(`[${traceId}]`, error);

    if (expose) {
      responseErrrorObject.error = String(error);
    }
  }

  return {
    statusCode,
    body: JSON.stringify({ error: responseErrrorObject }),
  };
};
