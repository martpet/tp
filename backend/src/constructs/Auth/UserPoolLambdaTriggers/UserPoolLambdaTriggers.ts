import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

import { Tables } from '~/constructs/Tables';
import { capitalize, createNodejsFunction } from '~/utils';

type TriggerName = 'postConfirmation' | 'postAuthentication';

type UserPoolLambdaTriggersProps = {
  triggers: TriggerName[];
  tables: Tables;
};

export class UserPoolLambdaTriggers extends Construct {
  public readonly lambdaTriggers: Partial<Record<TriggerName, NodejsFunction>> = {};

  constructor(
    scope: Construct,
    id: string,
    { triggers, tables }: UserPoolLambdaTriggersProps
  ) {
    super(scope, id);

    const { usersTable } = tables;

    triggers.forEach((triggerName) => {
      const fn = createNodejsFunction(this, capitalize(triggerName), {
        entry: `${__dirname}/lambda/${triggerName}/${triggerName}.ts`,
      });

      this.lambdaTriggers[triggerName] = fn;

      usersTable.grantReadWriteData(fn);
    });
  }
}
