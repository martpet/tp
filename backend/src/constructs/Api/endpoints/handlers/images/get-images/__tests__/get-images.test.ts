import { GetObjectCommand, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { lambdaPayloadLimit } from 'lambda-layer';

import {
  itCalls,
  itHasEnvVars,
  itHasQueryStrings,
  itResolves,
  itResolvesWithError,
  itSendsAwsCommand,
} from '~/constructs/Api/utils';

import { handler } from '../get-images';
import { processImage } from '../processImage';

vi.mock('../processImage');
vi.mock('~/constructs/Api/utils/errorResponse');

const ddbMock = mockClient(DynamoDBDocumentClient);
const s3Mock = mockClient(S3Client);

process.env.photoBucket = 'dummyPhotoBucketName';

const args = [
  {
    queryStringParameters: {
      fingerprint: 'dummyFingerprint',
      quality: '99',
      size: '888',
    },
  },
] as unknown as Parameters<typeof handler>;

beforeEach(() => {
  ddbMock.reset();
  s3Mock.reset();

  ddbMock.on(GetCommand).resolves({
    Item: { userId: 'dummyUserId' },
  });

  s3Mock.on(GetObjectCommand).resolves({
    Body: 'dummyBody',
  } as unknown as GetObjectCommandOutput);
});

describe('get-images', () => {
  itHasEnvVars(['photoBucket'], handler, args);
  itHasQueryStrings(['fingerprint'], handler, args);
  itSendsAwsCommand(GetCommand, ddbMock, handler, args);
  itSendsAwsCommand(GetObjectCommand, s3Mock, handler, args);
  itCalls(processImage, handler, args);
  itResolves(handler, args);

  describe('when "size" and "item" query strings do not cast to number', () => {
    const argsClone = structuredClone(args);
    const queryStrings = { ...args[0].queryStringParameters };
    delete queryStrings.size;
    delete queryStrings.quality;
    argsClone[0].queryStringParameters = queryStrings;
    itCalls(processImage, handler, argsClone);
  });

  describe('when "Item" is missing from "GetCommand" output', () => {
    beforeEach(() => {
      ddbMock.on(GetCommand).resolves({});
    });
    itResolvesWithError(handler, args);
  });

  describe('when "S3Client" rejects "GetObjectCommand"', () => {
    beforeEach(() => {
      s3Mock.on(GetObjectCommand).rejects('Dummy GetObjectCommand error');
    });
    itResolvesWithError(handler, args);
  });

  describe('when "Body" is missing from "GetObjectCommand" output', () => {
    beforeEach(() => {
      s3Mock.on(GetObjectCommand).resolves({});
    });
    itResolvesWithError(handler, args);
  });

  describe('when "processImage" rejects', () => {
    beforeEach(() => {
      vi.mocked(processImage).mockRejectedValueOnce('Dummy processImage error');
    });
    itResolvesWithError(handler, args);
  });

  describe('when "processImage" output length is bigger than lambda payload limit', () => {
    beforeEach(() => {
      vi.mocked(processImage).mockResolvedValue({
        length: lambdaPayloadLimit + 1,
      } as any);
    });
    itResolvesWithError(handler, args);
  });
});
