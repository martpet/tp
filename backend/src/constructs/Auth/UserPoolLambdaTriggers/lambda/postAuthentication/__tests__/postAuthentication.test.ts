import { PostAuthenticationTriggerHandler } from 'aws-lambda';

import { itResolves } from '~/constructs/Api/utils';

import { handler } from '../postAuthentication';
import { updateUserFromCognitoEvent } from '../updateUserFromCognitoEvent';
import event from './__fixtures__/postAuthenticationEvent';

vi.mock('../updateUserFromCognitoEvent');

const args = [event] as unknown as Parameters<PostAuthenticationTriggerHandler>;

describe('postAuthentication', () => {
  it('calls "updateUserFromCognitoEvent" with correct args', async () => {
    await handler(...args);
    expect(updateUserFromCognitoEvent).toHaveBeenCalledWith(event);
  });

  itResolves(handler, args);
});
