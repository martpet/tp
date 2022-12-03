export const createLoginCallbackScript = vi
  .fn()
  .mockName('createLoginCallbackScript')
  .mockReturnValue({
    script: 'dummyScript',
    cspHash: 'dummyCspHash',
  });
