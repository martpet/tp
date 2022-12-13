import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

import {
  findExistingFingerprints,
  itCalls,
  itGetsIdToken,
  itHasEnvVars,
  itHasJsonBody,
  itResolves,
} from '~/constructs/Api/utils';

import { handler } from '../post-upload-urls';

vi.mock('@aws-sdk/s3-presigned-post');
vi.mock('@aws-sdk/client-s3');
vi.mock('~/constructs/Api/utils/errorResponse');
vi.mock('~/constructs/Api/utils/getIdTokenPayload');
vi.mock('~/constructs/Api/utils/findExistingFingerprints');

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

describe('post-upload-urls', () => {
  itHasJsonBody(handler, args);
  itHasEnvVars(['photoBucket'], handler, args);
  itGetsIdToken(handler, args);
  itResolves(handler, args);
  itCalls(createPresignedPost, handler, args);
  itCalls(findExistingFingerprints, handler, args);
});
