import { getIdTokenPayload } from '~/constructs/Api/utils/getIdTokenPayload';

const args = ['.eyJkdW1teV9pZHRva2VuX2tleSI6ImR5bW15X2lkdG9rZW5fdmFsIn0=.'] as const;

describe('getIdTokenPayload', () => {
  it('returns a correct value', () => {
    return expect(getIdTokenPayload(...args)).resolves.toMatchSnapshot();
  });
});
