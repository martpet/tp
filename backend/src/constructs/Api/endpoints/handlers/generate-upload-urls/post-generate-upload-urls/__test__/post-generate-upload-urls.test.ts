import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

import {
  itCalls,
  itGetsIdToken,
  itHasEnvVars,
  itHasJsonBody,
  itResolves,
  itResolvesWithError,
} from '~/constructs/Api/utils';

import { findExistingItems } from '../findExistingItems';
import { handler } from '../post-generate-upload-urls';

vi.mock('@aws-sdk/s3-presigned-post');
vi.mock('@aws-sdk/client-s3');
vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');
vi.mock('../findExistingItems');

process.env.photoBucket = 'dummyPhotoBucket';

const args = [
  {
    headers: { authorization: 'dummyAuthorizationHeader' },
    body: JSON.stringify([
      {
        id: 'dummyId1',
        fingerprint: 'dummyFingerprint1',
        hash: 'dummyHash1',
      },
      {
        id: 'dummyId2',
        fingerprint: 'dummyFingerprint2',
        hash: 'dummyHash2',
      },
    ]),
  },
] as unknown as Parameters<typeof handler>;

describe('post-generate-upload-urls', () => {
  itHasJsonBody(handler, args);
  itHasEnvVars(['photoBucket'], handler, args);
  itGetsIdToken(handler, args);
  itResolves(handler, args);
  itCalls(createPresignedPost, handler, args);
  itCalls(findExistingItems, handler, args);

  describe('when `findExistingItems` throws', () => {
    beforeEach(() => {
      const error = new Error('dummyFindExistingItemsError');
      vi.mocked(findExistingItems).mockRejectedValueOnce(error);
    });
    itResolvesWithError(handler, args);
  });
});
