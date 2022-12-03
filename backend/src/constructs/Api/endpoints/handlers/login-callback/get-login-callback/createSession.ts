import {
  cookie,
  cookieName,
  crypto,
  DynamoDBClient,
  DynamoDBDocumentClient,
  millis,
  OauthTokens,
  PutCommand,
  refreshTokenValidityInDays,
  SessionsTableItem,
  sessionsTableOptions,
} from 'lambda-layer';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

type CreateSessionProps = {
  tokens: OauthTokens;
};

export const createSession = async ({ tokens }: CreateSessionProps) => {
  const { idTokenPayload, refreshToken, idToken } = tokens;
  const { envName } = globalLambdaProps;
  const sessionId = crypto.randomUUID();
  const created = Date.now();
  const refreshTokenExpires = created + millis.days(refreshTokenValidityInDays);

  const putCommand = new PutCommand({
    TableName: sessionsTableOptions.tableName,
    Item: {
      id: sessionId,
      userId: idTokenPayload.sub,
      created,
      refreshToken,
      refreshTokenExpires,
      idToken,
    } satisfies SessionsTableItem,
  });

  await ddbDocClient.send(putCommand);

  const sessionCookie = cookie.serialize(cookieName('sessionId'), sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: envName !== 'personal' || 'none',
    expires: new Date(refreshTokenExpires),
  });

  return sessionCookie;
};
