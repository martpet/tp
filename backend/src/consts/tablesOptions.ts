import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

import { SessionsTableItem, UsersTableItem } from '~/types';

import { createTableOptions } from '../constructs/Tables/createTableOptions';

export const usersTableOptions = createTableOptions<UsersTableItem>({
  tableName: 'Users',
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
});

export const sessionsTableOptions = createTableOptions<SessionsTableItem>({
  tableName: 'Sessions',
  partitionKey: {
    name: 'id',
    type: AttributeType.STRING,
  },
  timeToLiveAttribute: 'refreshTokenExpires',
  globalSecondaryIndexes: [
    {
      indexName: 'UserSessions',
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
