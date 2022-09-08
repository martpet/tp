import { PostAuthenticationTriggerEvent } from 'aws-lambda';

const event = {
  version: 'dummyPostAuthVersion',
  region: 'dummyPostAuthRegion',
  userPoolId: 'dummyPostAuthUserPoolId',
  userName: 'dummyPostAuthUserName',
  callerContext: {
    awsSdkVersion: 'dummyPostAuthAwsSdkVersion',
    clientId: 'dummyPostAuthClientId',
  },
  triggerSource: 'PostAuthentication_Authentication',
  request: {
    userAttributes: {
      sub: 'dummyPostAuthSub',
      email_verified: 'false',
      'cognito:user_status': 'EXTERNAL_PROVIDER',
      identities:
        '[{"userId":"182347123047012","providerName":"Google","providerType":"Google","issuer":null,"primary":true,"dateCreated":1658487089823}]',
      given_name: 'dummyPostAuthGivenName',
      family_name: 'dummyPostAuthFamilyName',
      email: 'dummyPostAuthEmail',
      picture: 'dummyPostAuthPictureUrl',
    },
    newDeviceUsed: false,
  },
  response: {},
} as PostAuthenticationTriggerEvent;

export default event;
