import crypto from 'crypto';

import { getRandomBase64UrlSafe } from '~/utils';

vi.mock('crypto');
vi.mock('util');

const callArgs = [128] as const;

describe('getRandomBase64UrlSafe', () => {
  it('calls "crypto.randomBytes" with correct args', async () => {
    await getRandomBase64UrlSafe(...callArgs);
    expect(vi.mocked(crypto.randomBytes).mock.calls).toMatchSnapshot();
  });

  it('calls "toString" from the return value of "crypto.randomBytes" with correct args', async () => {
    await getRandomBase64UrlSafe(...callArgs);
    expect(vi.mocked(crypto.randomBytes(1).toString).mock.calls).toMatchSnapshot();
  });

  it('resolves with a correct value', () => {
    return expect(getRandomBase64UrlSafe(...callArgs)).resolves.toMatchSnapshot();
  });
});
