import crypto from 'crypto';

import { itCalls, itResolves } from '~/constructs/Api/utils';
import { getRandomBase64UrlSafe } from '~/utils';

vi.mock('crypto');
vi.mock('util');

const args = [128] as Parameters<typeof getRandomBase64UrlSafe>;

describe('getRandomBase64UrlSafe', () => {
  itCalls(crypto.randomBytes, getRandomBase64UrlSafe, args);
  itCalls(crypto.randomBytes(1).toString, getRandomBase64UrlSafe, args);
  itResolves(getRandomBase64UrlSafe, args);
});
