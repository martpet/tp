import { itCalls, itReturns } from '~/constructs/Api/utils';
import { getAllowedOrigins, getEnvName } from '~/utils';

vi.mock('../getEnvName');

const args = ['dummyScope'] as unknown as Parameters<typeof getAllowedOrigins>;

describe('getAllowedOrigins', () => {
  itCalls(getEnvName, getAllowedOrigins, args);
  itReturns(getAllowedOrigins, args);

  describe('when the environment is "personal', () => {
    beforeEach(() => {
      vi.mocked(getEnvName).mockReturnValueOnce('personal');
    });
    itReturns(getAllowedOrigins, args);
  });
});
