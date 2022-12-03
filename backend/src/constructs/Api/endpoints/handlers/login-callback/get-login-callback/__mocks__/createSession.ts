export const createSession = vi
  .fn()
  .mockName('createSession')
  .mockResolvedValue('dummySessionCookie');
