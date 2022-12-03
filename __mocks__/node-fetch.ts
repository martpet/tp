export default vi
  .fn()
  .mockName('fetch')
  .mockResolvedValue({
    json: () => Promise.resolve(`dummyNodeFetchJsonParsedResponse`),
    ok: true,
  });
