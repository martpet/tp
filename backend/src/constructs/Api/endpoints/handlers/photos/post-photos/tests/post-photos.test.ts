import {
  findExistingFingerprints,
  itCalls,
  itGetsIdToken,
  itHasJsonBody,
  itResolves,
  itResolvesWithError,
} from '~/constructs/Api/utils';

import { createPhotoItems } from '../createPhotoItems';
import { handler } from '../post-photos';

vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');
vi.mock('~/constructs/Api/utils/findExistingFingerprints');
vi.mock('../createPhotoItems');

vi.mocked(findExistingFingerprints).mockResolvedValue([]);

const args = [
  {
    headers: { authorization: 'dummyAuthorizationHeader' },
    body: JSON.stringify([{ fingerprint: 'dummyFingerprint1' }]),
  },
] as unknown as Parameters<typeof handler>;

describe('post-photos', () => {
  itHasJsonBody(handler, args);
  itGetsIdToken(handler, args);
  itCalls(findExistingFingerprints, handler, args);
  itCalls(createPhotoItems, handler, args);
  itResolves(handler, args);

  describe('when "findExistingFingerprints" has results', () => {
    beforeEach(() => {
      vi.mocked(findExistingFingerprints).mockResolvedValueOnce([
        'dummyExistingFingerprint',
      ]);
    });
    itResolvesWithError(handler, args);
  });
});
