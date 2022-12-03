import { NestedStack } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { photosTableOptions, sessionsTableOptions, usersTableOptions } from '~/consts';

import { createTable } from './createTable';

export class Tables extends NestedStack {
  public readonly usersTable: Table;

  public readonly sessionsTable: Table;

  public readonly photosTable: Table;

  constructor(scope: Construct) {
    super(scope, 'Tables');

    this.usersTable = createTable(this, usersTableOptions);
    this.sessionsTable = createTable(this, sessionsTableOptions);
    this.photosTable = createTable(this, photosTableOptions);
  }
}
