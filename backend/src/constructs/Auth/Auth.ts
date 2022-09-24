import { Duration, RemovalPolicy } from 'aws-cdk-lib';
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
  authSubdomain,
  idTokenValidityInMinutes,
  localhostUrl,
  refreshTokenValidityInDays,
} from '~/consts';
import { getEnvName } from '~/utils';

import { IdentityProviders } from './IdentityProviders';
import { UserPoolLambdaTriggers } from './UserPoolLambdaTriggers';

type AuthProps = {
  zone: Zone;
  tables: Tables;
  web: Web;
};

export class Auth extends Construct {
  public readonly userPool: UserPool;

  public readonly userPoolClient: UserPoolClient;

  public readonly authDomain: string;

  public readonly loginCallbackUrl: string;

  public readonly logoutCallbackUrl: string;

  public readonly logoutCallbackLocalhostUrl: string;

  constructor(scope: Construct, id: string, { zone, tables, web }: AuthProps) {
    super(scope, id);

    const envName = getEnvName(this);
    const { appDomain } = appEnvs[envName];
    this.authDomain = `${authSubdomain}.${appDomain}`;
    const apiDomain = `${apiSubdomain}.${appDomain}`;
    this.loginCallbackUrl = `https://${apiDomain}${apiPaths.loginCallback}`;
    this.logoutCallbackUrl = `https://${appDomain}`;
    this.logoutCallbackLocalhostUrl = localhostUrl;

    const { lambdaTriggers } = new UserPoolLambdaTriggers(this, 'LambdaTriggers', {
      triggers: ['postConfirmation', 'postAuthentication'],
      tables,
    });

    this.userPool = new UserPool(this, 'UserPool', {
      lambdaTriggers,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const identityProvidres = new IdentityProviders(this, 'Providers', {
      userPool: this.userPool,
    });

    const logoutUrls = [this.logoutCallbackUrl];

    if (envName === 'personal') {
      logoutUrls.push(this.logoutCallbackLocalhostUrl);
    }

    this.userPoolClient = new UserPoolClient(this, 'Client', {
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
      idTokenValidity: Duration.minutes(idTokenValidityInMinutes),
      refreshTokenValidity: Duration.days(refreshTokenValidityInDays),
    });

    this.userPoolClient.node.addDependency(identityProvidres);

    const userPoolDomain = this.userPool.addDomain('UserPoolDomain', {
      customDomain: {
        domainName: this.authDomain,
        certificate: zone.certificate,
      },
    });

    userPoolDomain.node.addDependency(web);

    new ARecord(this, 'UserPoolDomainRecord', {
      zone: zone.hostedZone,
      recordName: authSubdomain,
      target: RecordTarget.fromAlias(new UserPoolDomainTarget(userPoolDomain)),
    });
  }
}
