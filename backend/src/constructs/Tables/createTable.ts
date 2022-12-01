import { RemovalPolicy } from 'aws-cdk-lib';
import { BillingMode, GlobalSecondaryIndexProps, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { TableOptions } from './types';

export const createTable = (
  scope: Construct,
  { globalSecondaryIndexes, ...tableProps }: TableOptions<any>
) => {
  const table = new Table(scope, tableProps.tableName, {
    ...tableProps,
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  if (globalSecondaryIndexes) {
    globalSecondaryIndexes.forEach((gsiProps) => {
      table.addGlobalSecondaryIndex({ ...gsiProps } as GlobalSecondaryIndexProps);
    });
  }

  return table;
};
