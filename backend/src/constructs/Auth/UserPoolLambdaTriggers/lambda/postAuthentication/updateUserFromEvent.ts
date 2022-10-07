import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { PostAuthenticationTriggerEvent } from 'aws-lambda';

import { usersTableOptions } from '~/consts';
import { UserPropsFromCognitoEvent, UsersTableItem } from '~/types';
import { createDynamoUpdateExpression, filterChangedProps } from '~/utils';

import { getUserPropsFromCognitoEvent } from '../getUserPropsFromCognitoEvent';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const updateUserFromEvent = async (event: PostAuthenticationTriggerEvent) => {
  const propsFromEvent = getUserPropsFromCognitoEvent(event);
  const userFromDb = await fetchUser(propsFromEvent);
  if (!userFromDb) {
    throw new Error(`could not find user with id "${propsFromEvent.id}"`);
  }
  const changedProps = filterChangedProps(propsFromEvent, userFromDb);
  if (!changedProps) {
    return undefined;
  }
  return updateUser({
    id: propsFromEvent.id,
    ...changedProps,
  });
};

async function fetchUser(props: UserPropsFromCognitoEvent) {
  const getCommand = new GetCommand(makeTableParams(props));
  const { Item } = await ddbDocClient.send(getCommand);
  return Item;
}

function updateUser(props: Partial<UsersTableItem>) {
  const updateCommand = new UpdateCommand({
    ...makeTableParams(props),
    ...createDynamoUpdateExpression(props),
  });

  return ddbDocClient.send(updateCommand);
}

function makeTableParams(props: Partial<UsersTableItem>) {
  const pkName = usersTableOptions.partitionKey.name;

  return {
    TableName: usersTableOptions.tableName,
    Key: { [pkName]: props[pkName] },
  };
}
