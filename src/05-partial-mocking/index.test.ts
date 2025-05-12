import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');
  const { mockOne, mockTwo, mockThree } = originalModule;

  return {
    ...originalModule,
    mockOne: jest.fn(mockOne).mockImplementation(() => {}),
    mockTwo: jest.fn(mockTwo).mockImplementation(() => {}),
    mockThree: jest.fn(mockThree).mockImplementation(() => {}),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const spyConsoleLog = jest.spyOn(console, 'log');

    mockOne();
    mockTwo();
    mockThree();
    expect(spyConsoleLog).not.toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    const spyConsoleLog = jest.spyOn(console, 'log');

    unmockedFunction();
    expect(spyConsoleLog).toHaveBeenCalledWith('I am not mocked');
  });
});
