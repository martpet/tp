import { ModerationLabel } from '@aws-sdk/client-rekognition';

import { PhotoExif } from '../PhotoExif';

export type PhotosTableItem = PhotoExif & {
  fingerprint: string;
  userId: string;
  createdAt: number;
  moderationLabels?: ModerationLabel[];
};
