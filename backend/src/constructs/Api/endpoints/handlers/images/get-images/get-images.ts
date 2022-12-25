import {
  APIGatewayProxyHandlerV2,
  apiOptions,
  DynamoDBClient,
  DynamoDBDocumentClient,
  EnvVars,
  errorResponse,
  GetCommand,
  GetImagesResponse,
  GetObjectCommand,
  lambdaPayloadLimit,
  PhotosTableItem,
  photosTableOptions,
  QueryStrings,
  S3Client,
  StatusCodes,
} from 'lambda-layer';

import { processImage } from './processImage';

const s3Client = new S3Client({});
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

export const handler: APIGatewayProxyHandlerV2<GetImagesResponse> = async ({
  queryStringParameters,
}) => {
  const { photoBucket } = process.env as EnvVars<'/images', 'GET'>;
  const { fingerprint, quality, size } = Object(
    queryStringParameters
  ) as QueryStrings<'/images'>;

  if (!photoBucket) {
    return errorResponse('68e8d0232f');
  }

  if (!fingerprint) {
    return errorResponse('564208f603', { statusCode: StatusCodes.BAD_REQUEST });
  }

  const photoItem = await getPhotoItem(fingerprint);

  if (!photoItem) {
    return errorResponse('5b2797f93a', { statusCode: StatusCodes.NOT_FOUND });
  }

  let stream;
  const s3ObjectName = `${photoItem.userId}/${fingerprint}`;

  try {
    stream = await getS3Stream(photoBucket, s3ObjectName);
  } catch (error) {
    return errorResponse('602d977044', { error });
  }

  if (!stream) {
    return errorResponse('dc1c2c42bf');
  }

  let base64Image;

  try {
    base64Image = await processImage({
      stream,
      photoBucket,
      s3ObjectName,
      size: Number(size) || undefined,
      quality: Number(quality) || undefined,
    });
  } catch (error) {
    return errorResponse('aa6d018607', { error });
  }

  if (base64Image.length > lambdaPayloadLimit) {
    return errorResponse('5fe36afa17');
  }

  return {
    statusCode: StatusCodes.OK,
    isBase64Encoded: true,
    body: base64Image,
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': `max-age=${apiOptions['/images'].cacheProps.maxTtl}`,
    },
  };
};

async function getPhotoItem(fingerprint: string) {
  const getCommand = new GetCommand({
    TableName: photosTableOptions.tableName,
    Key: { [photosTableOptions.partitionKey.name]: fingerprint },
  });
  const { Item } = await ddbDocClient.send(getCommand);
  const photoItem = Item as PhotosTableItem | undefined;
  return photoItem;
}

async function getS3Stream(photoBucket: string, s3ObjectName: string) {
  const getObjectCommand = new GetObjectCommand({
    Bucket: photoBucket,
    Key: s3ObjectName,
  });
  const { Body } = await s3Client.send(getObjectCommand);
  return Body;
}
