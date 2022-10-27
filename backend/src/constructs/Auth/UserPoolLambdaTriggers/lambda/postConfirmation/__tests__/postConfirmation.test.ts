import { PostConfirmationTriggerHandler } from 'aws-lambda';

import { itResolves } from '~/constructs/Api/utils';

import { createUserFromCognitoEvent } from '../createUserFromCognitoEvent';
import { handler } from '../postConfirmation';
import event from './__fixtures__/postConfirmationEvent';

vi.mock('../createUserFromCognitoEvent');

const args = [event] as unknown as Parameters<PostConfirmationTriggerHandler>;

describe('postConfirmation', () => {
  it('calls "createUserFromCognitoEvent" with correct args', async () => {
    await handler(...args);
    expect(createUserFromCognitoEvent).toHaveBeenCalledWith(event);
  });

  itResolves(handler, args);
});
