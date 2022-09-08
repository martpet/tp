import { Construct } from 'constructs';

import { getEnvName } from '~/utils/getEnvName';

const scope = {
  node: {
    tryGetContext: () => 'dummyEnvName',
  },
} as unknown as Construct;

describe('getEnvName', () => {
  it('returns the "envName"', () => {
    expect(getEnvName(scope)).toBe('dummyEnvName');
  });

  it('throws if "envName" context is missing', () => {
    scope.node.tryGetContext = () => '';
    expect(() => {
      getEnvName(scope);
    }).toThrowErrorMatchingSnapshot();
  });
});
