import {
  DetectModerationLabelsCommand,
  RekognitionClient,
} from '@aws-sdk/client-rekognition';
import { mockClient } from 'aws-sdk-client-mock';
import sharp from 'sharp';

import { itCalls, itResolves, itSendsAwsCommand } from '~/constructs/Api/utils';

import { processImage } from '../processImage';

vi.mock('sharp');

const rekognitionMock = mockClient(RekognitionClient);

beforeEach(() => {
  rekognitionMock.reset();
  rekognitionMock.on(DetectModerationLabelsCommand).resolves({});
});

const args = [
  {
    stream: {
      transformToByteArray: () => Promise.resolve('dummyByteArray'),
    },
    photoBucket: 'dummyPhotoBucketName',
    s3ObjectName: 'dummyS3ObjectName',
    size: 500,
    quality: 80,
  },
] as unknown as Parameters<typeof processImage>;

describe('processImage', async () => {
  itSendsAwsCommand(DetectModerationLabelsCommand, rekognitionMock, processImage, args);
  itCalls(sharp, processImage, args);
  itCalls(sharp().jpeg, processImage, args);
  itCalls(sharp().resize, processImage, args);
  itCalls(sharp().toBuffer, processImage, args);
  itCalls((await sharp().toBuffer()).toString, processImage, args);
  itResolves(processImage, args);

  describe('when optional props are missing', () => {
    const propsClone = { ...args[0] };
    const argsClone = [propsClone];
    propsClone.size = undefined;
    propsClone.quality = undefined;
    itCalls(sharp().jpeg, processImage, argsClone);
    itCalls(sharp().resize, processImage, argsClone);
  });

  describe('when "DetectModerationLabelsCommand" returns "Explicit Nudity"', () => {
    beforeEach(() => {
      rekognitionMock.on(DetectModerationLabelsCommand).resolves({
        ModerationLabels: [{ Name: 'Explicit Nudity' }],
      });
    });

    itCalls(sharp().blur, processImage, args);
  });
});
