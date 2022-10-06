import { RemovalPolicy } from 'aws-cdk-lib';
import { BillingMode, GlobalSecondaryIndexProps, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { createTableOptions } from './createTableOptions';

export const createTable = (
  scope: Construct,
  { globalSecondaryIndexes, ...tableProps }: ReturnType<typeof createTableOptions>
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
