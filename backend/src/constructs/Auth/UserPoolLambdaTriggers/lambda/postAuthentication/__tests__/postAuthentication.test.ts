import { PostAuthenticationTriggerHandler } from 'aws-lambda';

import { itResolvesCorrectly } from '~/constructs/Api/utils';

import { handler } from '../postAuthentication';
import { updateUserFromCognitoEvent } from '../updateUserFromCognitoEvent';
import event from './__fixtures__/postAuthenticationEvent';

vi.mock('../updateUserFromCognitoEvent');

const args = [event] as unknown as Parameters<PostAuthenticationTriggerHandler>;

describe('postAuthentication', () => {
  itResolvesCorrectly(handler, args);

  it('calls "updateUserFromCognitoEvent" with correct args', async () => {
    await handler(...args);
    expect(updateUserFromCognitoEvent).toHaveBeenCalledWith(event);
  });
});
