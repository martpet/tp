import { removeDateStringOffset } from '../removeDateStringOffset';

describe('removeDateStringOffset', () => {
  it('removes UTC representation', () => {
    expect(removeDateStringOffset('2022-11-17T10:08:23.917Z')).toMatchSnapshot();
  });

  it('removes positive offset', () => {
    expect(removeDateStringOffset('2022-11-17T10:08:23.917+02:00')).toMatchSnapshot();
  });

  it('removes negative offset', () => {
    expect(removeDateStringOffset('2022-11-17T10:08:23.917-02:00')).toMatchSnapshot();
  });

  it('returns original string if no offset representation', () => {
    expect(removeDateStringOffset('2022-11-17T10:08:23.917')).toMatchSnapshot();
  });
});
