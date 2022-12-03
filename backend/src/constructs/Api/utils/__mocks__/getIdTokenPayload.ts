export const getIdTokenPayload = vi.fn().mockName('getIdTokenPayload').mockResolvedValue({
  sub: 'dummySub',
  nonce: 'dummyNonce',
  aud: 'dummyAud',
  givenName: 'dummyGivenName',
  familyName: 'dummyFamilyName',
  picture: 'dummyPicture',
  email: 'dummyEmail',
});
