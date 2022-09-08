import { daysToMilliseconds } from '~/utils';

describe('daysToMilliseconds', () => {
  it('returns a correct value', () => {
    expect(daysToMilliseconds(5)).toMatchSnapshot();
  });
});
