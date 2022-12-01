import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import {
  itGetsIdToken,
  itHasEnvVars,
  itHasJsonBody,
  itResolves,
} from '~/constructs/Api/utils';
import { PostGenerateUploadUrlsResponse } from '~/types';

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
    body: JSON.stringify(['dummyHash1', 'dummyHash2']),
  },
] as unknown as Parameters<APIGatewayProxyHandlerV2<PostGenerateUploadUrlsResponse>>;

describe('post-generate-upload-urls', () => {
  itHasJsonBody(handler, args);
  itHasEnvVars(['photoBucket'], handler, args);
  itGetsIdToken(handler, args);
  itResolves(handler, args);

  it('calls `createPresignedPost` with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(createPresignedPost).mock.calls).toMatchSnapshot();
  });

  it('calls `findExistingItems` with correct args', async () => {
    await handler(...args);
    expect(vi.mocked(findExistingItems).mock.calls).toMatchSnapshot();
  });
});
