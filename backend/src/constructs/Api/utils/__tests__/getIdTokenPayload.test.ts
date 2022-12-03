import { itResolves } from '~/constructs/Api/utils';
import { getIdTokenPayload } from '~/constructs/Api/utils/getIdTokenPayload';

const args = [
  '.eyJkdW1teV9pZHRva2VuX2tleSI6ImR5bW15X2lkdG9rZW5fdmFsIn0=.',
] as unknown as Parameters<typeof getIdTokenPayload>;

describe('getIdTokenPayload', () => {
  itResolves(getIdTokenPayload, args);
});
