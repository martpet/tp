import { getEnvName } from '~/utils/getEnvName';

const tryGetContext = vi.fn().mockReturnValue('dummyEnvName');

const args = [
  {
    node: { tryGetContext },
  },
] as unknown as Parameters<typeof getEnvName>;

describe('getEnvName', () => {
  it('calls "tryGetContext" with correct args', () => {
    getEnvName(...args);
    expect(tryGetContext.mock.calls).toMatchSnapshot();
  });

  it('returns a correct value', () => {
    expect(getEnvName(...args)).toMatchSnapshot();
  });

  describe('when "envName" is missing from cdk context', () => {
    beforeEach(() => {
      tryGetContext.mockReturnValueOnce('');
    });

    it('throws correct error', () => {
      expect(() => {
        getEnvName(...args);
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
