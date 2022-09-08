import { PostConfirmationTriggerHandler } from 'aws-lambda';

import { createUserFromEvent } from '../createUserFromEvent';
import { handler } from '../postConfirmation';
import event from './__fixtures__/postConfirmationEvent';

vi.mock('../createUserFromEvent');

const args = [event] as unknown as Parameters<PostConfirmationTriggerHandler>;

describe('postConfirmation', () => {
  it('calls "createUserFromEvent" with correct args', async () => {
    await handler(...args);
    expect(createUserFromEvent).toHaveBeenCalledWith(event);
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toBe(event);
  });
});
