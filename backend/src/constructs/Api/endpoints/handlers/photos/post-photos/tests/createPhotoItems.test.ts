import { BatchWriteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { photosTableOptions } from 'lambda-layer';

import { itResolves, itSendsAwsCommand } from '~/constructs/Api/utils';

import { createPhotoItems } from '../createPhotoItems';

vi.mock('@aws-sdk/util-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [
  {
    requestData: [{ fingerprint: 'dummyFingerprint' }],
    sub: 'dummySub',
  },
] as Parameters<typeof createPhotoItems>;

beforeEach(() => {
  ddbMock.reset();
  ddbMock.on(BatchWriteCommand).resolves({});
});

describe('createPhotoItems', () => {
  itSendsAwsCommand(BatchWriteCommand, ddbMock, createPhotoItems, args);
  itResolves(createPhotoItems, args);

  describe('when called with 26 items', async () => {
    const argsClone = structuredClone(args);
    argsClone[0].requestData = Array(26);

    it('sends "BatchWriteCommand" 2 times', async () => {
      await createPhotoItems(...argsClone);
      expect(ddbMock.commandCalls(BatchWriteCommand).length).toBe(2);
    });
  });

  describe('when "BatchWriteCommand" response has "UnprocessedItems"', () => {
    beforeEach(() => {
      ddbMock
        .on(BatchWriteCommand)
        .resolvesOnce({
          UnprocessedItems: {
            [photosTableOptions.tableName]: [
              { PutRequest: { Item: { dummyUnprocessedKey: 'dummyUnprocessedValue' } } },
            ],
          },
        })
        .resolvesOnce({});
    });

    it('sends "BatchGetCommand" a second time with correct args', async () => {
      await createPhotoItems(...args);
      expect(ddbMock.commandCalls(BatchWriteCommand)[1].args[0].input).toMatchSnapshot();
    });
  });
});
