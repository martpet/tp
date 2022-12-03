import { itCalls, itReturns } from '~/constructs/Api/utils';
import { getEnvName } from '~/utils/getEnvName';

const tryGetContext = vi.fn().mockName('tryGetContext').mockReturnValue('dummyEnvName');

const args = [
  {
    node: { tryGetContext },
  },
] as unknown as Parameters<typeof getEnvName>;

describe('getEnvName', () => {
  itCalls(tryGetContext, getEnvName, args);
  itReturns(getEnvName, args);

  describe('when "envName" is missing from cdk context', () => {
    beforeEach(() => {
      tryGetContext.mockReturnValueOnce('');
    });

    it('throws correct error', () => {
      expect(() => getEnvName(...args)).toThrowErrorMatchingSnapshot();
    });
  });
});
