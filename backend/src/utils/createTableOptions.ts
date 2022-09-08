import { RemovalPolicy } from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  GlobalSecondaryIndexProps,
  TableProps,
} from 'aws-cdk-lib/aws-dynamodb';
import deepmerge from 'deepmerge';
import { Merge } from 'type-fest';

import { appName } from '~/consts/appConsts';

type Attr<T> = {
  [K in keyof T]?: {
    name: K;
    type: T[K] extends string
      ? AttributeType.STRING
      : T[K] extends number
      ? AttributeType.NUMBER
      : never;
  };
}[keyof T];

type Props<T> = Merge<
  TableProps,
  {
    tableName: string;
    partitionKey: Attr<T>;
    timeToLiveAttribute?: keyof T;
    globalSecondaryIndexes?: Record<
      string,
      Merge<
        GlobalSecondaryIndexProps,
        {
          partitionKey: Attr<T>;
          sortKey?: Attr<T>;
          indexName?: never;
        }
      >
    >;
  }
>;

export const createTableOptions = <T extends Record<string, any>>({
  tableName,
  ...tableProps
}: Props<T>) => {
  const defaultProps: Omit<TableProps, 'partitionKey'> = {
    tableName: `${appName}-${tableName}`,
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
  };

  return deepmerge(defaultProps, tableProps);
};
