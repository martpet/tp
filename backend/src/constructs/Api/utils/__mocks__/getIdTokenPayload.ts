export const getIdTokenPayload = vi.fn().mockResolvedValue({
  sub: 'dummySub',
  nonce: 'dummyNonce',
  aud: 'dummyAud',
  givenName: 'dummyGivenName',
  familyName: 'dummyFamilyName',
  picture: 'dummyPicture',
  email: 'dummyEmail',
});
