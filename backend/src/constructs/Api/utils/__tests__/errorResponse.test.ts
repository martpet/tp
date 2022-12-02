import { StatusCodes } from 'http-status-codes';

import { errorResponse, itReturnsCorrectly } from '~/constructs/Api/utils';
import { EnvName } from '~/types';

const args: Parameters<typeof errorResponse> = ['dummyTraceId'];

describe('errorResponse', () => {
  itReturnsCorrectly(errorResponse, args);

  it('calls "console.error" with correct args', () => {
    errorResponse(...args);
    expect(vi.mocked(console.error).mock.calls).toMatchSnapshot();
  });

  describe('when "statusCode" is provided', () => {
    const argsClone = structuredClone(args);
    argsClone.push({ statusCode: StatusCodes.IM_A_TEAPOT });
    itReturnsCorrectly(errorResponse, argsClone);
  });

  describe('when "description" is provided', () => {
    const argsClone = structuredClone(args);
    argsClone.push({ description: 'dummDescription' });
    itReturnsCorrectly(errorResponse, argsClone);
  });

  describe('when "error" is provided', () => {
    const argsWithError = structuredClone(args) as Required<typeof args>;
    argsWithError.push({ error: new Error('dummyErrorMessage') });

    it('calls "console.error" with correct args', () => {
      errorResponse(...argsWithError);
      expect(vi.mocked(console.error).mock.calls).toMatchSnapshot();
    });

    describe('when "exposeError" is true', () => {
      const argsWithExposedError = structuredClone(argsWithError);
      argsWithExposedError[1].exposeError = true;
      itReturnsCorrectly(errorResponse, argsWithExposedError);
    });

    describe.each(['personal', 'staging'])(
      'when "globalLambdaProps.envName" is "%s"',
      (key) => {
        beforeEach(() => {
          globalLambdaProps.envName = key as EnvName;
        });
        afterEach(() => {
          globalLambdaProps.envName = 'production';
        });
        itReturnsCorrectly(errorResponse, argsWithError);
      }
    );
  });
});
