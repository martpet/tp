import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { apiOptions, ApiPath } from 'lambda-layer';
import { RequireAtLeastOne } from 'type-fest';

import { Photos } from '~/constructs/Photos';
import { Tables } from '~/constructs/Tables';

type PermissionsCallbacks = Partial<{
  [P in ApiPath]: RequireAtLeastOne<
    Record<keyof typeof apiOptions[P]['methods'], (fn: NodejsFunction) => void>
  >;
}>;

export type PathWithPermissions = keyof PermissionsCallbacks;
export type MethodWithPermissions = keyof PermissionsCallbacks[PathWithPermissions];

export type Props = {
  tables: Tables;
  photos: Photos;
};

export const getPermissionsCallbacks = ({
  tables,
  photos,
}: Props): PermissionsCallbacks => ({
  '/login-callback': {
    GET: (f) => tables.sessionsTable.grantWriteData(f),
  },
  '/logout': {
    GET: (f) => tables.sessionsTable.grantWriteData(f),
  },
  '/me': {
    GET: (f) => tables.usersTable.grantReadData(f),
  },
  '/settings': {
    PATCH: (f) => tables.usersTable.grantWriteData(f),
  },
  '/upload-urls': {
    POST: (f) => {
      photos.bucket.grantPut(f);
      tables.photosTable.grantReadData(f);
    },
  },
  '/photos': {
    POST: (f) => tables.photosTable.grantReadWriteData(f),
  },
  '/images': {
    GET: (f) => {
      photos.bucket.grantReadWrite(f);
      tables.photosTable.grantReadData(f);
      f.addToRolePolicy(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['rekognition:DetectModerationLabels'],
          resources: ['*'],
        })
      );
    },
  },
});
