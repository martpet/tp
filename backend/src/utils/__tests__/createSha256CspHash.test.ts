import crypto from 'crypto';

import { itCalls } from '~/constructs/Api/utils';

import { createSha256CspHash } from '../createSha256CspHash';

vi.mock('crypto');

const args = ['dummyContent'] as Parameters<typeof createSha256CspHash>;

describe('createSha256CspHash', () => {
  itCalls(crypto.createHash, createSha256CspHash, args);
  itCalls(crypto.createHash('').update, createSha256CspHash, args);
  itCalls(crypto.createHash('').update('').digest, createSha256CspHash, args);
});
