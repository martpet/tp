import {
  AttributeType,
  GlobalSecondaryIndexProps,
  TableProps,
} from 'aws-cdk-lib/aws-dynamodb';
import { Merge, SetRequired } from 'type-fest';

import { appName } from '~/consts';

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

type Props<T> = SetRequired<TableProps, 'tableName'> & {
  partitionKey: Attr<T>;
  timeToLiveAttribute?: keyof T;
  globalSecondaryIndexes?: Array<
    Merge<
      GlobalSecondaryIndexProps,
      {
        partitionKey: Attr<T>;
        sortKey?: Attr<T>;
      }
    >
  >;
};

export const createTableOptions = <T extends Record<string, any>>(
  props: Props<T>
): Props<T> => {
  return {
    ...props,
    tableName: `${appName}-${props.tableName}`,
  };
};
