export default {
  randomBytes: vi
    .fn()
    .mockName('randomBytes')
    .mockReturnValue({
      toString: vi
        .fn()
        .mockName('toString')
        .mockReturnValue('dummyCryptoRandomBytesToString'),
    }),

  createHash: vi
    .fn()
    .mockName('createHash')
    .mockReturnValue({
      update: vi
        .fn()
        .mockName('update')
        .mockReturnValue({
          digest: vi
            .fn()
            .mockName('digest')
            .mockReturnValue('dummyCryptoCreateHashUpdateDigest'),
        }),
    }),
  randomUUID: vi.fn().mockReturnValue('dummyUUID'),
};
