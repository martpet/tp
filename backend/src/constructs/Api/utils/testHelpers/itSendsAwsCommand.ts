import { AwsCommand, AwsStub } from 'aws-sdk-client-mock';

import { CallbackAndArgsTuple } from '~/types';

export async function itSendsAwsCommand(
  command: new (param: any) => AwsCommand<any, any, any, any>,
  awsStub: AwsStub<any, any>,
  ...rest: CallbackAndArgsTuple
) {
  it(`sends "${
    command.name
  }" from "${awsStub.clientName()}" with correct args`, async () => {
    const [callback, callbackArgs = []] = rest;
    await callback(...callbackArgs);
    expect(awsStub.commandCalls(command)[0].args[0].input).toMatchSnapshot();
  });
}
