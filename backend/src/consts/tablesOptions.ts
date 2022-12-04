import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

import { makeTableOptions } from '~/constructs/Tables/makeTableOptions';
import { PhotosTableItem, SessionsTableItem, UsersTableItem } from '~/types';

export const usersTableOptions = makeTableOptions<UsersTableItem>({
  tableName: 'users',
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
});

export const sessionsTableOptions = makeTableOptions<SessionsTableItem>({
  tableName: 'sessions',
  timeToLiveAttribute: 'refreshTokenExpires',
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
  globalSecondaryIndexes: [
    {
      indexName: 'user-sessions',
      partitionKey: {
        name: 'userId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'created',
        type: AttributeType.NUMBER,
      },
    },
  ],
});

export const photosTableOptions = makeTableOptions<PhotosTableItem>({
  tableName: 'photos',
  partitionKey: {
    name: 'fingerprint',
    type: AttributeType.STRING,
  },
});
