import { AwsCommand, AwsStub } from 'aws-sdk-client-mock';

import { CallbackAndArgsTuple } from '~/types';

export async function itSendsAwsCommand(
  command: new (param: any) => AwsCommand<any, any, any, any>,
  awsStub: AwsStub<any, any>,
  ...rest: CallbackAndArgsTuple
) {
  const [callback, callbackArgs = []] = rest;

  it(`sends "${
    command.name
  }" from "${awsStub.clientName()}" with correct args`, async () => {
    await callback(...callbackArgs);
    // [todo] Make snapshot of all calls; remove unnecessary props
    expect(awsStub.commandCalls(command)[0].args[0].input).toMatchSnapshot();
  });
}
