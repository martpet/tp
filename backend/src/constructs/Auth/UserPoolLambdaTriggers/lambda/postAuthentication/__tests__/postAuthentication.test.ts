import { PostAuthenticationTriggerHandler } from 'aws-lambda';

import { handler } from '../postAuthentication';
import { updateUserFromEvent } from '../updateUserFromEvent';
import event from './__fixtures__/postAuthenticationEvent';

vi.mock('../updateUserFromEvent');

const args = [event] as unknown as Parameters<PostAuthenticationTriggerHandler>;

describe('postAuthentication', () => {
  it('calls "updateUserFromEvent" with correct args', async () => {
    await handler(...args);
    expect(updateUserFromEvent).toHaveBeenCalledWith(event);
  });

  it('resolves with a correct value', () => {
    return expect(handler(...args)).resolves.toBe(event);
  });
});
