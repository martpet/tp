import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

import { usersTableOptions } from '~/consts';
import { UsersTableItem } from '~/types';

import { getUserPropsFromCognitoEvent } from '../getUserPropsFromCognitoEvent';

const marshallOptions = { removeUndefinedValues: true };
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions });

export const createUserFromCognitoEvent = (event: PostConfirmationTriggerEvent) => {
  const item: UsersTableItem = {
    ...getUserPropsFromCognitoEvent(event),
    settings: {},
  };

  const putCommand = new PutCommand({
    TableName: usersTableOptions.tableName,
    Item: item,
  });

  return ddbDocClient.send(putCommand);
};
