export default vi.fn().mockResolvedValue({
  json: () => Promise.resolve(`dummyNodeFetchJsonParsedResponse`),
  ok: true,
});
