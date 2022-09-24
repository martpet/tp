import { LambdaEdgeViewerRequestHandler } from '~/constructs/Api/types';
import { lambdaEdgeErrorResponse } from '~/constructs/Api/utils';

export const itResolvesWithLambdaEdgeErrorResponse = (
  handler: LambdaEdgeViewerRequestHandler,
  args: Parameters<LambdaEdgeViewerRequestHandler>
) => {
  it('calls "lambdaEdgeErrorResponse" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(lambdaEdgeErrorResponse).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toMatchSnapshot();
  });
};
