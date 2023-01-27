import { cc } from '../src/utils/combineClassNames';

describe('test combineClassNames function', () => {
  it(`should return 'a b c'`, () => {
    expect(cc(['a', null, 'b', undefined, 'c'])).toBe('a b c');
  });

  it('should return undefined', () => {
    expect(cc([null, undefined, console.log])).toBe(undefined);
  });

  it(`should return 'x'`, () => {
    expect(cc([null, undefined, 'x', console.log])).toBe('x');
  });
});
