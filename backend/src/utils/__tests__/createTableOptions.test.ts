import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

import { createTableOptions } from '~/utils';

type DummyTableItem = {
  dummyAttr1: string;
  dummyAttr2: string;
  dummyAttr3: string;
};

const args = [
  {
    tableName: 'dummyTableName',
    partitionKey: {
      name: 'dummyAttr1',
      type: AttributeType.STRING,
    },
    timeToLiveAttribute: 'dummyAttr2',
    globalSecondaryIndexes: {
      byUser: {
        partitionKey: {
          name: 'dummyAttr3',
          type: AttributeType.STRING,
        },
      },
    },
  },
] as const;

describe('createTableOptions', () => {
  it('returns a correct value', () => {
    expect(createTableOptions<DummyTableItem>(...args)).toMatchSnapshot();
  });
});
