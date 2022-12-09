import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { apiOptions, ApiPath } from 'lambda-layer';
import { RequireAtLeastOne } from 'type-fest';

import { Photos } from '~/constructs/Photos';
import { Tables } from '~/constructs/Tables';

export type CallbackPath = keyof Callbacks;
export type CallbackMethod = keyof Callbacks[CallbackPath];

type Callbacks = Partial<{
  [P in ApiPath]: RequireAtLeastOne<
    Record<keyof typeof apiOptions[P]['methods'], (fn: NodejsFunction) => void>
  >;
}>;

export type Props = {
  tables: Tables;
  photos: Photos;
};

export const createRoutesCallbacks = ({ tables, photos }: Props): Callbacks => ({
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
});
