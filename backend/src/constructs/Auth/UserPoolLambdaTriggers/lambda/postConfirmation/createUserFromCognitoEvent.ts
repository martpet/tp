import { PostConfirmationTriggerEvent } from 'aws-lambda';
import {
  DynamoDBClient,
  DynamoDBDocumentClient,
  PutCommand,
  UsersTableItem,
  usersTableOptions,
} from 'lambda-layer';

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
