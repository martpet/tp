import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { errorResponse } from '~/constructs/Api/utils';

export const itResolvesWithErrorResponse = (
  handler: APIGatewayProxyHandlerV2,
  args: Parameters<APIGatewayProxyHandlerV2>
) => {
  it('calls "errorResponse" with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(errorResponse).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toMatchSnapshot();
  });
};
