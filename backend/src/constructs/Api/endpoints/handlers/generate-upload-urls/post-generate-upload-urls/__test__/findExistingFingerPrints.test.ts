import { BatchGetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { itResolves, itSendsAwsCommand, photosTableOptions } from 'lambda-layer';

import { findExistingFingerPrints } from '../findExistingFingerPrints';

vi.mock('@aws-sdk/util-dynamodb');

const ddbMock = mockClient(DynamoDBDocumentClient);

const args = [['fingerprint1']] as Parameters<typeof findExistingFingerPrints>;

beforeEach(() => {
  ddbMock.reset();

  ddbMock.on(BatchGetCommand).resolves({
    Responses: {
      [photosTableOptions.tableName]: [
        { fingerprint: 'existingFingerprint1' },
        { fingerprint: 'existingFingerprint1' },
      ],
    },
  });
});

describe('findExistingFingerPrints', () => {
  itSendsAwsCommand(BatchGetCommand, ddbMock, findExistingFingerPrints, args);
  itResolves(findExistingFingerPrints, args);

  describe('when called with 101 items', async () => {
    const argsClone = structuredClone(args);
    argsClone[0] = Array(101);

    it('sends "BatchGetCommand" 2 times', async () => {
      await findExistingFingerPrints(...argsClone);
      expect(ddbMock.commandCalls(BatchGetCommand).length).toBe(2);
    });
  });

  describe('when "BatchGetCommand" response is missing "Responses"', () => {
    beforeEach(() => {
      ddbMock.on(BatchGetCommand).resolves({});
    });
    itResolves(findExistingFingerPrints, args);
  });

  describe('when "BatchGetCommand" response has "UnprocessedKeys"', () => {
    beforeEach(() => {
      ddbMock
        .on(BatchGetCommand)
        .resolvesOnce({
          Responses: {
            [photosTableOptions.tableName]: [{ fingerprint: 'existingFingerprint3' }],
          },
          UnprocessedKeys: {
            [photosTableOptions.tableName]: { Keys: [{ dummyUnprocessedKey: '' }] },
          },
        })
        .resolvesOnce({
          Responses: {
            [photosTableOptions.tableName]: [{ fingerprint: 'existingFingerprint4' }],
          },
        });
    });

    it('sends "BatchGetCommand" a second time with correct args', async () => {
      await findExistingFingerPrints(...args);
      expect(ddbMock.commandCalls(BatchGetCommand)[1].args[0].input).toMatchSnapshot();
    });

    itResolves(findExistingFingerPrints, args);
  });
});
