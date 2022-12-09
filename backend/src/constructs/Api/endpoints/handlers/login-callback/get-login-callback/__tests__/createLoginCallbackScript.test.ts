import { itCalls, itReturns } from '~/constructs/Api/utils';
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
  itCalls(createSha256CspHash, createLoginCallbackScript, args);
  itReturns(createLoginCallbackScript, args);

  describe('when "envName" is "personal"', () => {
    const argsClone = structuredClone(args);
    argsClone[0].envName = 'personal';
    itReturns(createLoginCallbackScript, argsClone);
  });
});
