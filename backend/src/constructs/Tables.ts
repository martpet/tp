import { GlobalSecondaryIndexProps, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { sessionsTableOptions, usersTableOptions } from '~/consts';
import { createTableOptions } from '~/utils';

export class Tables extends Construct {
  public readonly usersTable: Table;

  public readonly sessionsTable: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.usersTable = makeTable(this, usersTableOptions);
    this.sessionsTable = makeTable(this, sessionsTableOptions);
  }
}

function makeTable(
  scope: Construct,
  { globalSecondaryIndexes, ...tableProps }: ReturnType<typeof createTableOptions>
) {
  const table = new Table(scope, tableProps.tableName, tableProps);

  if (globalSecondaryIndexes) {
    Object.entries(globalSecondaryIndexes).forEach(([key, gsiProps]) => {
      table.addGlobalSecondaryIndex({
        indexName: key,
        ...gsiProps,
      } as GlobalSecondaryIndexProps);
    });
  }

  return table;
}
