import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import * as lodash from 'lodash';
jest.mock('lodash');

const mockedLodash = lodash as jest.Mocked<typeof lodash>;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(10);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 10',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const accountSender = getBankAccount(10);
    const accountReceiver = getBankAccount(50);

    expect(() => accountSender.transfer(100, accountReceiver)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);

    expect(() => account.transfer(10, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    account.deposit(10);
    expect(account.getBalance()).toBe(initialBalance + 10);
  });

  test('should withdraw money', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    account.withdraw(10);
    expect(account.getBalance()).toBe(initialBalance - 10);
  });

  test('should transfer money', () => {
    const accountSender = getBankAccount(100);
    const accountReceiver = getBankAccount(10);

    accountSender.transfer(50, accountReceiver);
    expect(accountSender.getBalance()).toBe(50);
    expect(accountReceiver.getBalance()).toBe(60);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(0);
    const balance = 100;

    mockedLodash.random.mockReturnValueOnce(balance).mockReturnValueOnce(1);

    const result = await account.fetchBalance();
    expect(result).toBe(balance);
    expect(typeof result).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(0);
    const balance = 100;

    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(balance);

    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(balance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });

  afterEach(() => jest.restoreAllMocks());
});
