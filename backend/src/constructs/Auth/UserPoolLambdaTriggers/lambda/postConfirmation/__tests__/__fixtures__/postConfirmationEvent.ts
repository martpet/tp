import { PostConfirmationTriggerEvent } from 'aws-lambda';

const event = {
  version: 'dummyPostConfirmVersion',
  region: 'dummyPostConfirmRegion',
  userPoolId: 'dummyPostConfirmUserPoolId',
  userName: 'dummyPostConfirmUserName',
  callerContext: {
    awsSdkVersion: 'dummyPostConfirmAwsSdkVersion',
    clientId: 'dummyPostConfirmClientId',
  },
  triggerSource: 'PostConfirmation_ConfirmSignUp',
  request: {
    userAttributes: {
      sub: 'dummyPostConfirmSub',
      email_verified: 'dummyPostConfirmEmailVerified',
      'cognito:user_status': 'EXTERNAL_PROVIDER',
      identities:
        '[{"userId":"102975344697093363099","providerName":"Google","providerType":"Google","issuer":null,"primary":true,"dateCreated":1658604803064}]',
      given_name: 'dummuPostConfirmGivenName',
      family_name: 'dummyPostConfirmFamilyName',
      email: 'dummyPostConfirmEmail',
      picture: 'dummyPostConfirmPictureUrl',
    },
  },
  response: {},
} as PostConfirmationTriggerEvent;

export default event;
