import { StatusCodes } from 'http-status-codes';

import { errorResponse } from '~/constructs/Api/utils';

const args: Parameters<typeof errorResponse> = ['dummyTraceId'];

beforeEach(() => {
  global.cdkContextEnv = 'production';
});

describe('errorResponse', () => {
  it('returns a correct value', () => {
    expect(errorResponse(...args)).toMatchSnapshot();
  });

  describe('when "statusCode" is provided', () => {
    const argsClone = structuredClone(args);
    argsClone.push({ statusCode: StatusCodes.IM_A_TEAPOT });

    it('returns a correct value', () => {
      expect(errorResponse(...argsClone)).toMatchSnapshot();
    });
  });

  describe('when "description" is provided', () => {
    const argsClone = structuredClone(args);
    argsClone.push({ description: 'dummDescription' });

    it('returns a correct value', () => {
      expect(errorResponse(...argsClone)).toMatchSnapshot();
    });
  });

  describe('when "error" is provided', () => {
    const argsWithError = structuredClone(args) as Required<typeof args>;
    argsWithError.push({ error: new Error('dummyErrorMessage') });

    it('calls "console.error" with correct args', () => {
      errorResponse(...argsWithError);
      expect(vi.mocked(console.error).mock.calls).toMatchSnapshot();
    });

    describe('when "exposeErrorMessage" is true', () => {
      const argsWithExposedError = structuredClone(argsWithError);
      argsWithExposedError[1].exposeErrorMessage = true;

      it('returns a correct value', () => {
        expect(errorResponse(...argsWithExposedError)).toMatchSnapshot();
      });
    });

    describe('when "global.cdkContextEnv" is not "production"', () => {
      beforeEach(() => {
        global.cdkContextEnv = 'staging';
      });

      it('returns a correct value', () => {
        expect(errorResponse(...argsWithError)).toMatchSnapshot();
      });
    });
  });
});
