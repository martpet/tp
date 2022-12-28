import camelcaseKeys from 'camelcase-keys';
import {
  APIGatewayProxyHandlerV2,
  CognitoIdentityClient,
  EnvVars,
  errorResponse,
  GetCredentialsForIdentityCommand,
  GetIdCommand,
  GetPublicCredentialsResponse,
} from 'lambda-layer';

const client = new CognitoIdentityClient({});

export const handler: APIGatewayProxyHandlerV2<
  GetPublicCredentialsResponse
> = async () => {
  const { identityPoolId } = process.env as EnvVars<'/public-credentials', 'GET'>;

  if (!identityPoolId) {
    return errorResponse('c6d852203f');
  }

  const { IdentityId } = await client.send(
    new GetIdCommand({ IdentityPoolId: identityPoolId })
  );

  if (!IdentityId) {
    return errorResponse('b84787e3e6');
  }

  const { Credentials } = await client.send(
    new GetCredentialsForIdentityCommand({ IdentityId })
  );

  if (!Credentials) {
    return errorResponse('d76fddbcb4');
  }

  return camelcaseKeys(Credentials);
};
