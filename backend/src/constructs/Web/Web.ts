import { resolve } from 'app-root-path';
import { Duration, NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import {
  CachePolicy,
  Distribution,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

import { Zone } from '~/constructs';
import { appEnvs } from '~/consts';
import { getEnvName } from '~/utils';

type WebProps = {
  zone: Zone;
};

export class Web extends NestedStack {
  constructor(scope: Construct, id: string, { zone }: WebProps) {
    super(scope, id);

    const envName = getEnvName(this);
    const { appDomain } = appEnvs[envName];
    const { certificate, hostedZone } = zone;

    const destinationBucket = new Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new Distribution(this, 'Distro', {
      defaultBehavior: {
        origin: new S3Origin(destinationBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: new CachePolicy(this, 'CachePolicy', {
          minTtl: Duration.days(365),
        }),
      },
      defaultRootObject: 'index.html',
      domainNames: [appDomain],
      certificate,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: `/index.html`,
        },
      ],
      enableLogging: true,
      logIncludesCookies: true,
    });

    new BucketDeployment(this, 'BucketDeployment', {
      sources: [Source.asset(resolve('frontend/dist'))],
      destinationBucket,
      distribution,
    });

    new ARecord(this, 'Alias', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}
