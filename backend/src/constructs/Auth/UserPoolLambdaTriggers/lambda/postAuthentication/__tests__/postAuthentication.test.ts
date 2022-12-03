import { itCalls, itResolves } from '~/constructs/Api/utils';

import { handler } from '../postAuthentication';
import { updateUserFromCognitoEvent } from '../updateUserFromCognitoEvent';
import event from './__fixtures__/postAuthenticationEvent';

vi.mock('../updateUserFromCognitoEvent');

const args = [event] as unknown as Parameters<typeof handler>;

describe('postAuthentication', () => {
  itCalls(updateUserFromCognitoEvent, handler, args);
  itResolves(handler, args);
});
