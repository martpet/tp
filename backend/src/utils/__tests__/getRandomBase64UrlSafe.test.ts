import crypto from 'crypto';

import { itResolvesCorrectly } from '~/constructs/Api/utils';
import { getRandomBase64UrlSafe } from '~/utils';

vi.mock('crypto');
vi.mock('util');

const args = [128] as Parameters<typeof getRandomBase64UrlSafe>;

describe('getRandomBase64UrlSafe', () => {
  itResolvesCorrectly(getRandomBase64UrlSafe, args);

  it('calls "crypto.randomBytes" with correct args', async () => {
    await getRandomBase64UrlSafe(...args);
    expect(vi.mocked(crypto.randomBytes).mock.calls).toMatchSnapshot();
  });

  it('calls "toString" from the return value of "crypto.randomBytes" with correct args', async () => {
    await getRandomBase64UrlSafe(...args);
    expect(vi.mocked(crypto.randomBytes(1).toString).mock.calls).toMatchSnapshot();
  });
});
