import { getAllowedOrigins } from '~/utils/getAllowedOrigins';
import { getEnvName } from '~/utils/getEnvName';

vi.mock('../getEnvName');

const args = ['dummyScope'] as unknown as Parameters<typeof getAllowedOrigins>;

describe('getAllowedOrigins', () => {
  it('calls "getEnvName" with corrects args', () => {
    getAllowedOrigins(...args);
    expect(vi.mocked(getEnvName).mock.calls).toMatchSnapshot();
  });

  it('returns a correct value', () => {
    expect(getAllowedOrigins(...args)).toMatchSnapshot();
  });

  describe('when the environment is "personal', () => {
    beforeEach(() => {
      vi.mocked(getEnvName).mockReturnValueOnce('personal');
    });

    it('returns a correct value', () => {
      expect(getAllowedOrigins(...args)).toMatchSnapshot();
    });
  });
});
