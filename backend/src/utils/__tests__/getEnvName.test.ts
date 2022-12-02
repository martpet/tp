import { itReturnsCorrectly } from 'lambda-layer';

import { getEnvName } from '~/utils/getEnvName';

const tryGetContext = vi.fn().mockReturnValue('dummyEnvName');

const args = [
  {
    node: { tryGetContext },
  },
] as unknown as Parameters<typeof getEnvName>;

describe('getEnvName', () => {
  itReturnsCorrectly(getEnvName, args);

  it('calls "tryGetContext" with correct args', () => {
    getEnvName(...args);
    expect(tryGetContext.mock.calls).toMatchSnapshot();
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
