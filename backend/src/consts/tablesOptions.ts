import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

import { SessionsTableItem, UsersTableItem } from '~/types';

import { makeTableOptions } from '../constructs/Tables/makeTableOptions';

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
