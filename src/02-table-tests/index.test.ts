import { simpleCalculator, Action } from './index';

const testCases = [
  //valid
  { a: 1, b: 0, action: Action.Add, expected: 1 },
  { a: 42, b: 24, action: Action.Add, expected: 66 },
  { a: 42, b: 24, action: Action.Subtract, expected: 18 },
  { a: 24, b: 42, action: Action.Subtract, expected: -18 },
  { a: 42, b: 2, action: Action.Multiply, expected: 84 },
  { a: 42, b: 0, action: Action.Multiply, expected: 0 },
  { a: 42, b: 2, action: Action.Divide, expected: 21 },
  { a: 6, b: 2, action: Action.Exponentiate, expected: 36 },
  { a: 2, b: 4, action: Action.Exponentiate, expected: 16 },
  {
    a: Number.MAX_VALUE,
    b: 1,
    action: Action.Add,
    expected: Number.MAX_VALUE,
  },
  //invalid
  { a: '1', b: 2, action: Action.Add, expected: null },
  { a: 1, b: '2', action: Action.Subtract, expected: null },
  { a: 2, b: 2, action: '%', expected: null },
  { a: null, b: 2, action: Action.Multiply, expected: null },
  { a: 1, b: undefined, action: Action.Divide, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    `Test #$#: should return $expected for (a: $a, b: $b, action:$action)`,
    (testCase) => {
      expect(simpleCalculator(testCase)).toBe(testCase.expected);
    },
  );
});
