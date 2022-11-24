import { StatusCodes } from 'http-status-codes';

export type ApiErrorResponseBody = {
  error: {
    statusCode: StatusCodes;
    traceId: string;
    message: string;
    error?: string;
    description?: string;
  };
};
