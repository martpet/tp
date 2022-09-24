import { getReasonPhrase } from 'http-status-codes';

import { LambdaEdgeResponse } from '~/constructs/Api/types';
import { errorResponse } from '~/constructs/Api/utils';

export const lambdaEdgeErrorResponse = (
  ...errorResponseArgs: Parameters<typeof errorResponse>
): LambdaEdgeResponse => {
  const { statusCode, body } = errorResponse(...errorResponseArgs);

  const response: LambdaEdgeResponse = {
    status: statusCode,
    statusDescription: getReasonPhrase(statusCode),
    headers: { 'content-type': [{ value: 'application/json' }] },
    body,
  };

  return response;
};
