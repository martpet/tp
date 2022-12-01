import { itReturns } from 'lambda-layer';

import { createSha256CspHash } from '~/utils/createSha256CspHash';

import { createLoginCallbackScript } from '../createLoginCallbackScript';

vi.mock('~/utils/createSha256CspHash');

const args = [
  {
    envName: 'production',
    appDomain: 'dummyAppDomain',
  },
] as Parameters<typeof createLoginCallbackScript>;

describe('createLoginCallbackScript', () => {
  itReturns(createLoginCallbackScript, args);

  it('calls "createSha256CspHash" with corrects args', () => {
    createLoginCallbackScript(...args);
    expect(vi.mocked(createSha256CspHash).mock.calls).toMatchSnapshot();
  });

  describe('when "envName" is "personal"', () => {
    const argsClone = structuredClone(args);
    argsClone[0].envName = 'personal';
    itReturns(createLoginCallbackScript, argsClone);
  });
});
