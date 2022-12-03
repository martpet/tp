export default {
  serialize: vi.fn().mockName('serialize').mockReturnValue('dummyCookie'),
  parse: vi.fn().mockName('parse'),
};
