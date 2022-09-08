export const promisify = (fn: Function) => (arg: unknown) => Promise.resolve(fn(arg));
