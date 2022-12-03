import {
  errorResponse,
  itCalls,
  itReturns,
  lambdaEdgeErrorResponse,
} from '~/constructs/Api/utils';

vi.mock('../errorResponse');

const args = ['dummyArg1', 'dummyArg2'] as unknown as Parameters<
  typeof lambdaEdgeErrorResponse
>;

vi.mocked(errorResponse).mockReturnValue({
  statusCode: 418,
  body: 'dummyErrorResponseBody',
});

describe('lambdaEdgeErrorResponse', () => {
  itCalls(errorResponse, lambdaEdgeErrorResponse, args);
  itReturns(lambdaEdgeErrorResponse, args);
});
