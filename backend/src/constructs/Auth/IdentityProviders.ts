import {
  ProviderAttribute,
  UserPool,
  UserPoolIdentityProviderApple,
  UserPoolIdentityProviderGoogle,
} from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

import {
  appEnvs,
  applePrivateKeyParamName,
  appleTeamId,
  googleClientSecretParamName,
} from '~/consts';
import { getEnvName } from '~/utils';

import { OAuthSecrets } from './OAuthSecrets';

type IdentityProvidersProps = {
  userPool: UserPool;
};

export class IdentityProviders extends Construct {
  constructor(scope: Construct, id: string, { userPool }: IdentityProvidersProps) {
    super(scope, id);

    const { appleClientId, appleKeyId, googleClientId, oauthSecretsRoleArn } =
      appEnvs[getEnvName(this)];

    const { googleSecret, appleSecret } = new OAuthSecrets(this, 'oauth-secrets', {
      roleArn: oauthSecretsRoleArn,
      ssmParamsNames: {
        apple: applePrivateKeyParamName,
        google: googleClientSecretParamName,
      },
    });

    new UserPoolIdentityProviderApple(this, 'apple-identity-provider', {
      userPool,
      teamId: appleTeamId,
      clientId: appleClientId,
      keyId: appleKeyId,
      privateKey: appleSecret,
      scopes: ['email', 'name'],
      attributeMapping: {
        email: ProviderAttribute.APPLE_EMAIL,
        givenName: ProviderAttribute.APPLE_FIRST_NAME,
        familyName: ProviderAttribute.APPLE_LAST_NAME,
      },
    });

    new UserPoolIdentityProviderGoogle(this, 'google-identity-provider', {
      userPool,
      clientId: googleClientId,
      clientSecret: googleSecret,
      scopes: ['email', 'profile'],
      attributeMapping: {
        email: ProviderAttribute.GOOGLE_EMAIL,
        givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
        familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
        profilePicture: ProviderAttribute.GOOGLE_PICTURE,
      },
    });
  }
}
