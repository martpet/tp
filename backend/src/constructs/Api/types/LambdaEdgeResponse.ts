import { StatusCodes } from 'http-status-codes';

export type LambdaEdgeResponse = {
  status: StatusCodes;
  body?: string;
  bodyEncoding?: 'text' | 'base64';
  statusDescription?: string;
  headers?: Record<
    string,
    Array<{
      key?: string;
      value: string;
    }>
  >;
};
