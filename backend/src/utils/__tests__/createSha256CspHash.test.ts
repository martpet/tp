import crypto from 'crypto';

import { createSha256CspHash } from '../createSha256CspHash';

vi.mock('crypto');

const args = ['dummyContent'] as Parameters<typeof createSha256CspHash>;

describe('createSha256CspHash', () => {
  it('calls "createHash" with a correct value', async () => {
    await createSha256CspHash(...args);
    expect(vi.mocked(crypto.createHash).mock.calls).toMatchSnapshot();
  });

  it('calls "update" on the return value of "createHash" with a correct value', async () => {
    await createSha256CspHash(...args);
    expect(vi.mocked(crypto.createHash('').update).mock.calls).toMatchSnapshot();
  });

  it('calls "digest" on the return value of "update" with a correct value', async () => {
    await createSha256CspHash(...args);
    expect(
      vi.mocked(crypto.createHash('').update('').digest).mock.calls
    ).toMatchSnapshot();
  });
});
