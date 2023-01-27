import { isNil } from '../src/utils/isNil';

describe('test isNil function', () => {
  it(`should return true`, () => {
    expect(isNil(null)).toBe(true);
  });

  it(`should return false`, () => {
    expect(isNil('ABC')).toBe(false);
  });
});
