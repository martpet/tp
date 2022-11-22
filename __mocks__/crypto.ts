export default {
  randomBytes: vi.fn().mockReturnValue({
    toString: vi.fn().mockReturnValue('dummyCryptoRandomBytesToString'),
  }),

  createHash: vi.fn().mockReturnValue({
    update: vi.fn().mockReturnValue({
      digest: vi.fn().mockReturnValue('dummyCryptoCreateHashUpdateDigest'),
    }),
  }),

  randomUUID: vi.fn().mockReturnValue('dummyUUID'),
};
