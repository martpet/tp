import { SdkStreamMixin } from '@aws-sdk/types';
import { DetectModerationLabelsCommand, RekognitionClient } from 'lambda-layer';
import sharp from 'sharp';

const rekognition = new RekognitionClient({});

type Props = {
  stream: SdkStreamMixin;
  photoBucket: string;
  s3ObjectName: string;
  quality?: number;
  size?: number;
};

export async function processImage({
  stream,
  photoBucket,
  s3ObjectName,
  size = 1500,
  quality = 100,
}: Props) {
  const moderationCommand = new DetectModerationLabelsCommand({
    Image: { S3Object: { Bucket: photoBucket, Name: s3ObjectName } },
    MinConfidence: 90,
  });
  const { ModerationLabels } = await rekognition.send(moderationCommand);
  const uint8 = await stream.transformToByteArray();
  const image = sharp(uint8).jpeg({ quality }).resize(size);
  const isModerated = ModerationLabels?.some(({ Name }) => Name === 'Explicit Nudity');

  if (isModerated) {
    image.blur(75);
  }

  const buffer = await image.toBuffer();
  const base64 = buffer.toString('base64');
  return base64;
}
