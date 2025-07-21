// Sample Jest test for backend Meteor method: transactions.insert

// Mock Meteor and Mongo
jest.mock('meteor/meteor', () => ({
  Meteor: {
    methods: jest.fn((methods) => { global.meteorMethods = methods; }),
    users: {
      findOneAsync: jest.fn(),
    },
  },
}));
jest.mock('../transaction', () => ({
  TransactionsCollection: {
    insertAsync: jest.fn(),
  },
}));

// Import the file to register Meteor.methods
require('../TransactionsMethods');

const { Meteor } = require('meteor/meteor');
const { TransactionsCollection } = require('../transaction');
jest.mock('meteor/check', () => ({
  check: jest.fn(),
}));
describe('transactions.insert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('inserts a transaction with accountant username', async () => {
    const userId = 'user1';
    const user = { username: 'accountant1' };
    const transaction = {
      senderUsername: 'sender1',
      receiverUsername: 'receiver1',
      amount: 100,
      createdAt: new Date(),
    };
    Meteor.users.findOneAsync = jest.fn().mockResolvedValue(user);
    TransactionsCollection.insertAsync = jest.fn().mockResolvedValue('txid');


    const method = global.meteorMethods['transactions.insert'];
    const result = await method.call({ userId }, transaction);

    expect(Meteor.users.findOneAsync).toHaveBeenCalledWith(userId);
    expect(TransactionsCollection.insertAsync).toHaveBeenCalledWith({
      accountantUsername: 'accountant1',
      ...transaction,
    });
    expect(result).toBe('txid');
  });
});


describe('transactions.update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

it('update a transaction', async () => {
  const userId = 'user1';
  const user = { username: 'accountant1' };
  const transaction = {
    _id: 'tid',
    senderUsername: 'sender1',
    receiverUsername: 'receiver1',
    amount: 100,
    createdAt: new Date(),
  };
  Meteor.users.findOneAsync = jest.fn().mockResolvedValue(user);
  TransactionsCollection.updateAsync = jest.fn().mockResolvedValue('txid');

  const method = global.meteorMethods['transactions.update'];
  const result = await method.call({ userId }, transaction);

  expect(Meteor.users.findOneAsync).toHaveBeenCalledWith(userId);
  expect(TransactionsCollection.updateAsync).toHaveBeenCalledWith(
    'tid',
    {
      $set: {
        accountantUsername: 'accountant1',
        receiverUsername: 'receiver1',
        amount: 100,
        createdAt: transaction.createdAt,
      },
    }
  );
  expect(result).toBe('txid');
});
});

describe('transactions.remove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('removes a transaction by ID', async () => {
    TransactionsCollection.removeAsync = jest.fn().mockResolvedValue('removed');
    const method = global.meteorMethods['transactions.remove'];
    const result = await method.call({}, 'tid');
    expect(TransactionsCollection.removeAsync).toHaveBeenCalledWith('tid');
    expect(result).toBe('removed');
  });
});

describe('transactions.getUserBalance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct user balance', async () => {
    const username = 'user1';
    const received = [{ amount: 100 }, { amount: 50 }];
    const sent = [{ amount: 30 }, { amount: 20 }];
    TransactionsCollection.find = jest.fn()
      .mockReturnValueOnce({ fetchAsync: jest.fn().mockResolvedValue(received) })
      .mockReturnValueOnce({ fetchAsync: jest.fn().mockResolvedValue(sent) });
    const method = global.meteorMethods['transactions.getUserBalance'];
    const result = await method.call({}, username);
    expect(result).toEqual({
      username: 'user1',
      balance: 100,
      totalReceived: 150,
      totalSent: 50,
    });
  });
});

describe('transactions.getAllUserNames', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all usernames', async () => {
    const users = [
      { username: 'user1' },
      { username: 'user2' },
    ];
    Meteor.users.find = jest.fn().mockReturnValue({ fetchAsync: jest.fn().mockResolvedValue(users) });
    const method = global.meteorMethods['transactions.getAllUserNames'];
    const result = await method.call({});
    expect(result).toEqual(['user1', 'user2']);
  });
});

describe('transactions.getBalancesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns balances for all users', async () => {
  const transactions = [
    { senderUsername: 'a', receiverUsername: 'b', amount: 10, createdA: new Date() },
    { senderUsername: 'b', receiverUsername: 'a', amount: 5, createdA: new Date() },
  ];
  TransactionsCollection.find = jest.fn().mockReturnValue({ fetch: () => transactions });
  const method = global.meteorMethods['transactions.getBalancesList'];
  const result = await method.call({});
  console.log(result);
  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ username: 'a' }),
      expect.objectContaining({ username: 'b' }),
    ])
  );
});
});

describe('transactions.getTransactionslist', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all transactions', async () => {
    const transactions = [
      { _id: 1 },
      { _id: 2 },
    ];
    TransactionsCollection.find = jest.fn().mockReturnValue({ fetchAsync: jest.fn().mockResolvedValue(transactions) });
    const method = global.meteorMethods['transactions.getTransactionslist'];
    const result = await method.call({});
    expect(result).toEqual(transactions);
  });
});

describe('transactions.updateUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates username and transactions', async () => {
    Meteor.users.findOneAsync = jest.fn()
      .mockResolvedValueOnce(null) // new username does not exist
      .mockResolvedValueOnce({ _id: 1, username: 'old' }); // old username exists
    Meteor.users.updateAsync = jest.fn().mockResolvedValue({ modifiedCount: 1 });
    TransactionsCollection.updateAsync = jest.fn()
      .mockResolvedValueOnce(2) // sender
      .mockResolvedValueOnce(1); // receiver
    const method = global.meteorMethods['transactions.updateUser'];
    const result = await method.call({}, 'old', 'new');
    expect(result).toEqual({
      senderTransactionsUpdated: 2,
      receiverTransactionsUpdated: 1,
      totalUpdated: 3,
      userUpdated: true,
    });
  });
});
