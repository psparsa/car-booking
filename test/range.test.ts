import { range } from '../src/utils/range';

describe('test range function', () => {
  it(`should return [3,4,5,6]`, () => {
    expect(range(3, 6)).toEqual([3, 4, 5, 6]);
  });
});
