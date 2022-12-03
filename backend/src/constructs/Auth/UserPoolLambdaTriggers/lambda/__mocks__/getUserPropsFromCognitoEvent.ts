export const getUserPropsFromCognitoEvent = vi
  .fn()
  .mockName('getUserPropsFromCognitoEvent')
  .mockReturnValue({
    id: 'dummyId',
    dummyUserPropFromCognitoEventKey: 'dummyUserPropFromCognitoEventValue',
  });
