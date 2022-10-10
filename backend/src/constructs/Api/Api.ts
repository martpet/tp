import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Fn, NestedStack } from 'aws-cdk-lib';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

import { Auth, Tables, Zone } from '~/constructs';
import { createDistroBehaviors } from '~/constructs/Api/endpoints/createDistroBehaviors';
import { createRoutes } from '~/constructs/Api/endpoints/createRoutes';
import { apiSubdomain, appEnvs } from '~/consts';
import { getEnvName } from '~/utils';

type ApiProps = {
  zone: Zone;
  auth: Auth;
  tables: Tables;
};

export class Api extends NestedStack {
  constructor(scope: Construct, id: string, { zone, tables, auth }: ApiProps) {
    super(scope, id);

    const envName = getEnvName(this);
    const { appDomain } = appEnvs[envName];
    const apiDomain = `${apiSubdomain}.${appDomain}`;
    const api = new HttpApi(this, 'HttpApi');
    const origin = new HttpOrigin(Fn.select(1, Fn.split('://', api.apiEndpoint)));

    const distribution = new Distribution(this, 'Distro', {
      defaultBehavior: { origin },
      domainNames: [apiDomain],
      certificate: zone.certificate,
      enableLogging: true,
      logIncludesCookies: true,
    });

    createRoutes({ scope, api, auth, tables });

    createDistroBehaviors({
      scope,
      api,
      auth,
      tables,
      distribution,
      origin,
    });

    new ARecord(this, 'Alias', {
      zone: zone.hostedZone,
      recordName: apiSubdomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}
