import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

import { SessionsTableItem, UsersTableItem } from '~/types';

import { createTableOptions } from '../constructs/Tables/createTableOptions';

export const usersTableOptions = createTableOptions<UsersTableItem>({
  tableName: 'users',
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
});

export const sessionsTableOptions = createTableOptions<SessionsTableItem>({
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
