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

type Props = {
  zone: Zone;
};

export class Web extends NestedStack {
  constructor(scope: Construct, { zone }: Props) {
    super(scope, 'Web');

    const envName = getEnvName(this);
    const { appDomain } = appEnvs[envName];
    const { certificate, hostedZone } = zone;

    const destinationBucket = new Bucket(this, 'frontend-bucket', {
      bucketName: `tp-frontend-assets-${envName}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const logBucket = new Bucket(this, 'web-distro-log-bucket', {
      bucketName: `tp-web-distro-logs-${envName}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new Distribution(this, 'web-distribution', {
      defaultBehavior: {
        origin: new S3Origin(destinationBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: new CachePolicy(this, 'web-distro-cache-poicy', {
          minTtl: Duration.days(365),
          enableAcceptEncodingBrotli: true,
          enableAcceptEncodingGzip: true,
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
      logBucket,
    });

    new BucketDeployment(this, 'web-deployment', {
      sources: [Source.asset(resolve('frontend/dist'))],
      destinationBucket,
      distribution,
    });

    new ARecord(this, 'web-a-record', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}
