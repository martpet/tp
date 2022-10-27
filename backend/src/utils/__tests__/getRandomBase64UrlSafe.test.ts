import crypto from 'crypto';

import { itResolves } from '~/constructs/Api/utils';
import { getRandomBase64UrlSafe } from '~/utils';

vi.mock('crypto');
vi.mock('util');

const args = [128] as Parameters<typeof getRandomBase64UrlSafe>;

describe('getRandomBase64UrlSafe', () => {
  it('calls "crypto.randomBytes" with correct args', async () => {
    await getRandomBase64UrlSafe(...args);
    expect(vi.mocked(crypto.randomBytes).mock.calls).toMatchSnapshot();
  });

  it('calls "toString" from the return value of "crypto.randomBytes" with correct args', async () => {
    await getRandomBase64UrlSafe(...args);
    expect(vi.mocked(crypto.randomBytes(1).toString).mock.calls).toMatchSnapshot();
  });

  itResolves(getRandomBase64UrlSafe, args);
});
