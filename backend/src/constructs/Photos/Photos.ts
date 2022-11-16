import { NestedStack, RemovalPolicy } from 'aws-cdk-lib';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { getEnvName } from '~/utils';

export class Photos extends NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const envName = getEnvName(this);

    new Bucket(scope, 'PhotosBucket', {
      encryption: BucketEncryption.S3_MANAGED,
      autoDeleteObjects: true,
      removalPolicy:
        envName === 'personal' ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    });
  }
}
