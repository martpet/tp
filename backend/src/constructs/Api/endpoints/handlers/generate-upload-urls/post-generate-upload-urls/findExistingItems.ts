import {
  BatchGetCommand,
  DynamoDBClient,
  DynamoDBDocument,
  photosTableOptions,
  unmarshall,
} from 'lambda-layer';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(ddbClient);

export const findExistingItems = async (fingerprints: string[]) => {
  const { tableName, partitionKey } = photosTableOptions;
  const result: string[] = [];

  async function batchGet(keys: Record<string, any>[]) {
    const batchGetCommand = new BatchGetCommand({
      RequestItems: { [tableName]: { Keys: keys } },
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

  const keys = fingerprints.map((fingerprint) => ({ [partitionKey.name]: fingerprint }));
  const maxItems = 100;
  const promises = [];

  for (let i = 0; i < keys.length; i += maxItems) {
    const chunk = keys.slice(i, i + maxItems);
    promises.push(batchGet(chunk));
  }

  await Promise.all(promises);

  return result;
};
