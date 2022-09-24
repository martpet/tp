export const getIdTokenPayload = vi.fn().mockReturnValue({
  sub: 'dummySub',
  nonce: 'dummyNonce',
  aud: 'dummyAud',
  givenName: 'dummyGivenName',
});
