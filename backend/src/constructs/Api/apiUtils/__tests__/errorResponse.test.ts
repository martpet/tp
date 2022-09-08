import { StatusCodes } from 'http-status-codes';

import { errorResponse } from '../errorResponse';

const args: Parameters<typeof errorResponse> = ['dummyTraceId'];

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
    const argsClone = structuredClone(args);
    argsClone.push({ error: new Error('dummyErrorMessage') });

    it('calls "console.error" with correct args', () => {
      errorResponse(...argsClone);
      expect(vi.mocked(console.error).mock.calls).toMatchSnapshot();
    });
  });

  describe('when "error" is provided and "expose" is true', () => {
    const argsClone = structuredClone(args);
    argsClone.push({
      error: new Error('dummyErrorMessage'),
      expose: true,
    });

    it('returns a correct value', () => {
      expect(errorResponse(...argsClone)).toMatchSnapshot();
    });
  });
});
