import {
  createDynamoUpdateExpression,
  DynamoDBClient,
  DynamoDBDocumentClient,
  filterChangedProps,
  GetCommand,
  PostAuthenticationTriggerEvent,
  UpdateCommand,
  UserPropsFromCognito,
  UsersTableItem,
  usersTableOptions,
} from 'lambda-layer';

import { getUserPropsFromCognitoEvent } from '../getUserPropsFromCognitoEvent';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const updateUserFromCognitoEvent = async (
  event: PostAuthenticationTriggerEvent
) => {
  const propsFromEvent = getUserPropsFromCognitoEvent(event);
  const user = await fetchUser(propsFromEvent);

  if (!user) {
    throw new Error(`could not find user with id "${propsFromEvent.id}"`);
  }

  const changedProps = filterChangedProps(propsFromEvent, user);

  if (!changedProps) {
    return undefined;
  }

  const updateCommand = new UpdateCommand({
    ...makeTableParams(user),
    ...createDynamoUpdateExpression(changedProps),
  });

  return ddbDocClient.send(updateCommand);
};

async function fetchUser(props: UserPropsFromCognito) {
  const getCommand = new GetCommand(makeTableParams(props));
  const { Item } = await ddbDocClient.send(getCommand);
  return Item;
}

function makeTableParams(props: Partial<UsersTableItem>) {
  const pkName = usersTableOptions.partitionKey.name;
  return {
    TableName: usersTableOptions.tableName,
    Key: { [pkName]: props[pkName] },
  };
}
