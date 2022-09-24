import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

import { usersTableOptions } from '~/consts';

import { getUserPropsFromCognitoEvent } from '../getUserPropsFromCognitoEvent';

const marshallOptions = { removeUndefinedValues: true };
const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, { marshallOptions });

export const createUserFromEvent = (event: PostConfirmationTriggerEvent) => {
  const userProps = getUserPropsFromCognitoEvent(event);

  const putCommand = new PutCommand({
    TableName: usersTableOptions.tableName,
    Item: userProps,
  });

  return ddbDocClient.send(putCommand);
};
