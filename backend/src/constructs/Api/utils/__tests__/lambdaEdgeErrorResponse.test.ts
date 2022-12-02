import {
  errorResponse,
  itReturnsCorrectly,
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
  it('calls "errorResponse" with correct args', () => {
    lambdaEdgeErrorResponse(...args);
    expect(vi.mocked(errorResponse).mock.calls).toMatchSnapshot();
  });
  itReturnsCorrectly(lambdaEdgeErrorResponse, args);
});
