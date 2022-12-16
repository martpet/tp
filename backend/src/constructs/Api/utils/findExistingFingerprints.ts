import {
  BatchGetCommand,
  DynamoDBClient,
  DynamoDBDocument,
  photosTableOptions,
  unmarshall,
} from 'lambda-layer';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(ddbClient);

export const findExistingFingerprints = async (fingerprints: string[]) => {
  const { tableName, partitionKey } = photosTableOptions;
  const result: string[] = [];

  async function batchGet(Keys: Record<string, any>[]) {
    const batchGetCommand = new BatchGetCommand({
      RequestItems: { [tableName]: { Keys } },
    });
    const { Responses, UnprocessedKeys } = await ddbDocClient.send(batchGetCommand);

    if (Responses) {
      Responses[tableName].forEach(({ fingerprint }) => result.push(fingerprint));
    }
    if (UnprocessedKeys) {
      const nextKeys = UnprocessedKeys[tableName]?.Keys?.map((key) => unmarshall(key));
      if (nextKeys) {
        await batchGet(nextKeys);
      }
    }
  }

  const batchSize = 100;
  const requests = [];

  for (let i = 0; i < fingerprints.length; i += batchSize) {
    const chunk = fingerprints.slice(i, i + batchSize);
    const keys = chunk.map((fingerprint) => ({ [partitionKey.name]: fingerprint }));
    requests.push(batchGet(keys));
  }

  await Promise.all(requests);
  return result;
};
