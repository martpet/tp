import { getUserPropsFromCognitoEvent } from '../getUserPropsFromCognitoEvent';
import event from '../postConfirmation/__tests__/__fixtures__/postConfirmationEvent';

describe('getUserPropsFromCognitoEvent', () => {
  it('returns a correct value', () => {
    expect(getUserPropsFromCognitoEvent(event)).toMatchSnapshot();
  });
});
