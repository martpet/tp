import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { AttributeValue, PostAuthenticationTriggerEvent } from 'aws-lambda';

import { usersTableOptions } from '~/consts';
import { UserPropsFromCognitoEvent, UsersTableItem } from '~/types';
import { filterChangedProps } from '~/utils';

import { getUserPropsFromCognitoEvent } from '../getUserPropsFromCognitoEvent';

const ddbClient = new DynamoDBClient({});
const ddbDocumentClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const updateUserFromEvent = async (event: PostAuthenticationTriggerEvent) => {
  const propsFromEvent = getUserPropsFromCognitoEvent(event);
  const userFromDb = await fetchUser(propsFromEvent);
  if (!userFromDb) {
    throw new Error('User does not exist');
  }
  const changedProps = filterChangedProps(propsFromEvent, userFromDb);
  if (!changedProps) {
    return undefined;
  }
  return updateUser(changedProps);
};

async function fetchUser(props: UserPropsFromCognitoEvent) {
  const getCommand = new GetCommand(makeTableParams(props));
  const { Item } = await ddbDocumentClient.send(getCommand);
  return Item;
}

function updateUser(props: Partial<UsersTableItem>) {
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, AttributeValue> = {};
  const actions: string[] = [];

  Object.entries(props).forEach(([key, val]) => {
    actions.push(`#${key} = :${key}`);
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = marshall({ [key]: val });
  });

  const updateCommand = new UpdateCommand({
    ...makeTableParams(props),
    UpdateExpression: `set ${actions.join(',')}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  });

  return ddbDocumentClient.send(updateCommand);
}

function makeTableParams(props: Partial<UsersTableItem>) {
  const pkName = usersTableOptions.partitionKey.name;

  return {
    TableName: usersTableOptions.tableName,
    Key: { [pkName]: props[pkName] },
  };
}
