import { NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BucketEncryption, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { getAllowedOrigins, getEnvName } from '~/utils';

export class Photos extends NestedStack {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const envName = getEnvName(this);

    this.bucket = new Bucket(scope, 'PhotosBucket', {
      cors: [
        {
          allowedMethods: [HttpMethods.POST],
          allowedOrigins: getAllowedOrigins(scope),
        },
      ],
      encryption: BucketEncryption.S3_MANAGED,
      autoDeleteObjects: envName === 'personal',
      removalPolicy:
        envName === 'personal' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    });
  }
}
