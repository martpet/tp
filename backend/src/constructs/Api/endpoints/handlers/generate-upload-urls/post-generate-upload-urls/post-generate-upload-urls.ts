// import { S3Client } from '@aws-sdk/client-s3';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

import { HandlerEnvVars } from '~/constructs/Api/types';

// const s3Client = new S3Client({});

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const { photosBucket } = process.env as HandlerEnvVars<'/generate-upload-urls', 'POST'>;

  if (!photosBucket) {
    return 'foo';
  }

  return photosBucket;
};
