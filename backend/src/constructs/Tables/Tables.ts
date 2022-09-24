import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { sessionsTableOptions, usersTableOptions } from '~/consts';

import { createTable } from './createTable';

export class Tables extends Construct {
  public readonly usersTable: Table;

  public readonly sessionsTable: Table;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.usersTable = createTable(this, usersTableOptions);
    this.sessionsTable = createTable(this, sessionsTableOptions);
  }
}
