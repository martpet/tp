import { itCalls, itResolves } from '~/constructs/Api/utils';

import { createUserFromCognitoEvent } from '../createUserFromCognitoEvent';
import { handler } from '../postConfirmation';
import event from './__fixtures__/postConfirmationEvent';

vi.mock('../createUserFromCognitoEvent');

const args = [event] as unknown as Parameters<typeof handler>;

describe('postConfirmation', () => {
  itCalls(createUserFromCognitoEvent, handler, args);
  itResolves(handler, args);
});
