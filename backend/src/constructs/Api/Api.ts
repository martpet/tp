import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Fn, NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { Auth, Photos, Tables, Zone } from '~/constructs';
import { apiSubdomain, appEnvs } from '~/consts';
import { getEnvName } from '~/utils';

import { createDistroBehaviors } from './endpoints/authEdgeFunction/createDistroBehaviors';
import { createRoutes } from './endpoints/createRoutes';

type Props = {
  zone: Zone;
  auth: Auth;
  tables: Tables;
  photos: Photos;
};

export class Api extends NestedStack {
  constructor(scope: Construct, { zone, tables, auth, photos }: Props) {
    super(scope, 'Api');

    const envName = getEnvName(this);
    const { appDomain } = appEnvs[envName];
    const apiDomain = `${apiSubdomain}.${appDomain}`;
    const api = new HttpApi(this, 'http-api');
    const origin = new HttpOrigin(Fn.select(1, Fn.split('://', api.apiEndpoint)));

    const logBucket = new Bucket(this, 'api-distro-log-bucket', {
      bucketName: 'tp-api-distro-logs',
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new Distribution(this, 'api-distribution', {
      defaultBehavior: { origin },
      domainNames: [apiDomain],
      certificate: zone.certificate,
      enableLogging: true,
      logIncludesCookies: true,
      logBucket,
    });

    createRoutes({ scope, api, auth, tables, photos });

    createDistroBehaviors({
      scope,
      api,
      auth,
      tables,
      distribution,
      origin,
    });

    new ARecord(this, 'api-a-record', {
      zone: zone.hostedZone,
      recordName: apiSubdomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}
