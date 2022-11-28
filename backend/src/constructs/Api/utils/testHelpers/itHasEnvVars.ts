import { CallbackAndArgsTuple } from '~/types';

import { itResolvesWithError } from './itResolvesWithError';

export function itHasEnvVars(keys: string[], ...rest: CallbackAndArgsTuple) {
  const [handler, handlerArgs = []] = rest;
  const envVars = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

  describe.each(keys)('when "%s" env var is missing', (key) => {
    beforeEach(() => {
      delete process.env[key];
    });

    afterEach(() => {
      process.env[key] = envVars[key];
    });

    itResolvesWithError(handler, handlerArgs);
  });
}
