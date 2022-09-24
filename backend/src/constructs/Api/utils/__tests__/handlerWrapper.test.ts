import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { handlerWrapper } from '~/constructs/Api/utils';

const fn = vi.fn().mockReturnValue('dummyFnReturnValue');
const fnArgs = ['dummyFnArg'] as unknown as Parameters<APIGatewayProxyHandlerV2>;

describe('"handlerWrapper" returns a wrapper function that', () => {
  const wrapperFn = handlerWrapper(fn);

  test('calls the wrapped function with its call args ', () => {
    wrapperFn(...fnArgs);
    expect(fn.mock.calls).toMatchSnapshot();
  });

  test('returns the return value of the wrapped function ', () => {
    expect(wrapperFn(...fnArgs)).toMatchSnapshot();
  });
});
