import { IdentityPool } from '@aws-cdk/aws-cognito-identitypool-alpha';
import { Duration, NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import {
  UserPool,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { UserPoolDomainTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

import { Tables, Web, Zone } from '~/constructs';
import {
  apiPaths,
  apiSubdomain,
  appEnvs,
  appName,
  authSubdomain,
  idTokenValidityInDays,
  localhostUrl,
  refreshTokenValidityInDays,
} from '~/consts';
import { getEnvName } from '~/utils';

import { IdentityProviders } from './IdentityProviders';
import { UserPoolLambdaTriggers } from './UserPoolLambdaTriggers';

type Props = {
  zone: Zone;
  tables: Tables;
  web: Web;
};

export class Auth extends NestedStack {
  public readonly publicIdentityPool: IdentityPool;

  public readonly userPool: UserPool;

  public readonly userPoolClient: UserPoolClient;

  public readonly authDomain: string;

  public readonly loginCallbackUrl: string;

  public readonly logoutCallbackUrl: string;

  public readonly logoutCallbackLocalhostUrl: string;

  constructor(scope: Construct, { zone, tables, web }: Props) {
    super(scope, 'Auth');

    const envName = getEnvName(this);
    const { appDomain } = appEnvs[envName];
    this.authDomain = `${authSubdomain}.${appDomain}`;
    const apiDomain = `${apiSubdomain}.${appDomain}`;
    this.loginCallbackUrl = `https://${apiDomain}${apiPaths['login-callback']}`;
    this.logoutCallbackUrl = `https://${appDomain}`;
    this.logoutCallbackLocalhostUrl = localhostUrl;

    this.publicIdentityPool = new IdentityPool(this, 'public-identity-pool', {
      identityPoolName: `${appName}-public`,
      allowUnauthenticatedIdentities: true,
    });

    const { lambdaTriggers } = new UserPoolLambdaTriggers(
      this,
      'user-pool-lambda-triggers',
      {
        triggers: ['postConfirmation', 'postAuthentication'],
        tables,
      }
    );

    this.userPool = new UserPool(this, 'user-pool', {
      lambdaTriggers,
      removalPolicy: RemovalPolicy.DESTROY,
      userPoolName: appName,
    });

    const identityProvidres = new IdentityProviders(
      this,
      'user-pool-identity-providers',
      {
        userPool: this.userPool,
      }
    );

    const logoutUrls = [this.logoutCallbackUrl];

    if (envName === 'personal') {
      logoutUrls.push(this.logoutCallbackLocalhostUrl);
    }

    this.userPoolClient = new UserPoolClient(this, 'user-pool-client', {
      userPool: this.userPool,
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.APPLE,
        UserPoolClientIdentityProvider.GOOGLE,
      ],
      oAuth: {
        callbackUrls: [this.loginCallbackUrl],
        logoutUrls,
        flows: {
          authorizationCodeGrant: true,
        },
      },
      idTokenValidity: Duration.days(idTokenValidityInDays),
      refreshTokenValidity: Duration.days(refreshTokenValidityInDays),
    });

    this.userPoolClient.node.addDependency(identityProvidres);

    const userPoolDomain = this.userPool.addDomain('user-pool-domain', {
      customDomain: {
        domainName: this.authDomain,
        certificate: zone.certificate,
      },
    });

    userPoolDomain.node.addDependency(web);

    new ARecord(this, 'auth-a-record', {
      zone: zone.hostedZone,
      recordName: authSubdomain,
      target: RecordTarget.fromAlias(new UserPoolDomainTarget(userPoolDomain)),
    });
  }
}
