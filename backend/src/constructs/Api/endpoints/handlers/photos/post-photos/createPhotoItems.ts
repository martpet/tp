import {
  BatchWriteCommand,
  DynamoDBClient,
  DynamoDBDocument,
  PhotosTableItem,
  photosTableOptions,
  PostPhotosRequest,
  unmarshall,
} from 'lambda-layer';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(ddbClient);

type Props = {
  requestData: PostPhotosRequest;
  sub: string;
};

export const createPhotoItems = async ({ requestData, sub }: Props) => {
  const { tableName } = photosTableOptions;

  async function batchWrite(photoItems: PhotosTableItem[]) {
    const batchWriteCommand = new BatchWriteCommand({
      RequestItems: { [tableName]: photoItems.map((Item) => ({ PutRequest: { Item } })) },
    });
    const { UnprocessedItems } = await ddbDocClient.send(batchWriteCommand);

    if (UnprocessedItems) {
      const nextItems: PhotosTableItem[] = [];
      UnprocessedItems[tableName]?.forEach(({ PutRequest }) => {
        if (PutRequest?.Item) {
          nextItems.push(unmarshall(PutRequest.Item) as PhotosTableItem);
        }
      });
      if (nextItems.length) {
        await batchWrite(nextItems);
      }
    }
  }

  const batchSize = 25;
  const requests = [];

  for (let i = 0; i < requestData.length; i += batchSize) {
    const chunk = requestData.slice(i, i + batchSize);
    const photoItems = chunk.map((item) => ({
      ...item,
      userId: sub,
      createdAt: Date.now(),
    }));
    requests.push(batchWrite(photoItems));
  }

  await Promise.all(requests);
};
