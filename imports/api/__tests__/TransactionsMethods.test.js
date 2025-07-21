// Fixed Jest test for backend Meteor method: transactions.insert

// Mock Meteor and Mongo BEFORE importing anything
const mockTransactionsCollection = {
  insertAsync: jest.fn(),
  removeAsync: jest.fn(),
  updateAsync: jest.fn(),
  find: jest.fn(),
  findOneAsync: jest.fn(),
};

const mockMeteorUsers = {
  findOneAsync: jest.fn(),
  find: jest.fn(),
  updateAsync: jest.fn(),
};

const mockAccounts = {
  createUserAsync: jest.fn(),
};

jest.mock('../transaction', () => ({
  TransactionsCollection: mockTransactionsCollection,
}));

jest.mock('meteor/meteor', () => ({
  Meteor: {
    methods: jest.fn((methods) => { 
      global.meteorMethods = methods; 
    }),
    users: mockMeteorUsers,
    Error: class MockError extends Error {
      constructor(error, reason) {
        super(reason || error);
        this.error = error;
        this.reason = reason;
      }
    },
  },
}));

jest.mock('meteor/check', () => ({
  check: jest.fn(),
}));

jest.mock('meteor/accounts-base', () => ({
  Accounts: mockAccounts,
}));

// Import AFTER mocking
require('../TransactionsMethods');

describe('TransactionsMethods', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock implementations
    mockTransactionsCollection.find.mockReturnValue({ 
      fetchAsync: jest.fn(),
      fetch: jest.fn() 
    });
    mockMeteorUsers.find.mockReturnValue({ 
      fetchAsync: jest.fn() 
    });
  });

  it('transactions.insert inserts a transaction with accountant username', async () => {
    const userId = 'user1';
    const user = { username: 'accountant1' };
    const transaction = {
      senderUsername: 'sender1',
      receiverUsername: 'receiver1',
      amount: 100,
      createdAt: new Date(),
    };

    // Setup mocks for this specific test
    mockMeteorUsers.findOneAsync.mockResolvedValue(user);
    mockTransactionsCollection.insertAsync.mockResolvedValue('txid');

    const method = global.meteorMethods['transactions.insert'];
    
    // Make sure method exists and is async
    expect(method).toBeDefined();
    
    const result = await method.call({ userId }, transaction);
    
    expect(mockMeteorUsers.findOneAsync).toHaveBeenCalledWith(userId);
    expect(mockTransactionsCollection.insertAsync).toHaveBeenCalledWith({
      accountantUsername: 'accountant1',
      ...transaction,
    });
    expect(result).toBe('txid');
  });

  it('transactions.remove removes a transaction by ID', async () => {
    mockTransactionsCollection.removeAsync.mockResolvedValue(1);
    
    const method = global.meteorMethods['transactions.remove'];
    expect(method).toBeDefined();
    
    const result = await method.call({}, 'tid');
    
    expect(mockTransactionsCollection.removeAsync).toHaveBeenCalledWith('tid');
    expect(result).toBe(1);
  });

  it('transactions.update updates a transaction', async () => {
    const userId = 'user1';
    const user = { username: 'accountant1' };
    const transaction = {
      _id: 'tid',
      senderUsername: 'sender1',
      receiverUsername: 'receiver1',
      amount: 200,
      createdAt: new Date(),
    };

    mockMeteorUsers.findOneAsync.mockResolvedValue(user);
    mockTransactionsCollection.updateAsync.mockResolvedValue(1);

    const method = global.meteorMethods['transactions.update'];
    const result = await method.call({ userId }, transaction);

    expect(mockTransactionsCollection.updateAsync).toHaveBeenCalledWith(
      'tid',
      {
        $set: {
          accountantUsername: 'accountant1',
          senderUsername: 'sender1', // Add this if missing
          receiverUsername: 'receiver1',
          amount: 200,
          createdAt: transaction.createdAt,
        },
      }
    );
    expect(result).toBe(1);
  });

  it('transactions.getUserBalance returns correct balance', async () => {
    const username = 'user1';
    const received = [{ amount: 100 }, { amount: 50 }];
    const sent = [{ amount: 30 }, { amount: 20 }];

    // Setup chained mock calls
    const mockFetchAsync1 = jest.fn().mockResolvedValue(received);
    const mockFetchAsync2 = jest.fn().mockResolvedValue(sent);
    
    mockTransactionsCollection.find
      .mockReturnValueOnce({ fetchAsync: mockFetchAsync1 })
      .mockReturnValueOnce({ fetchAsync: mockFetchAsync2 });

    const method = global.meteorMethods['transactions.getUserBalance'];
    const result = await method.call({}, username);

    expect(result).toEqual({
      username: 'user1',
      balance: 100,
      totalReceived: 150,
      totalSent: 50,
    });
  });

  it('transactions.getAllUserNames returns all usernames', async () => {
    const users = [
      { username: 'user1' },
      { username: 'user2' },
    ];

    const mockFetchAsync = jest.fn().mockResolvedValue(users);
    mockMeteorUsers.find.mockReturnValue({ fetchAsync: mockFetchAsync });

    const method = global.meteorMethods['transactions.getAllUserNames'];
    const result = await method.call({});

    expect(result).toEqual(['user1', 'user2']);
  });

  it('transactions.getBalancesList returns balances for all users', () => {
    const transactions = [
      { senderUsername: 'a', receiverUsername: 'b', amount: 10 },
      { senderUsername: 'b', receiverUsername: 'a', amount: 5 },
    ];

    const mockFetch = jest.fn().mockReturnValue(transactions);
    mockTransactionsCollection.find.mockReturnValue({ fetch: mockFetch });

    const method = global.meteorMethods['transactions.getBalancesList'];
    const result = method.call({});

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: 'a' }),
        expect.objectContaining({ username: 'b' }),
      ])
    );
  });

  it('transactions.getTransactionslist returns all transactions', async () => {
    const transactions = [
      { _id: 1 },
      { _id: 2 },
    ];

    const mockFetchAsync = jest.fn().mockResolvedValue(transactions);
    mockTransactionsCollection.find.mockReturnValue({ fetchAsync: mockFetchAsync });

    const method = global.meteorMethods['transactions.getTransactionslist'];
    const result = await method.call({});

    expect(result).toEqual(transactions);
  });

  it('transactions.updateUser updates username and transactions', async () => {
    const oldUsername = 'old';
    const newUsername = 'new';

    mockMeteorUsers.findOneAsync
      .mockResolvedValueOnce(null) // new username does not exist
      .mockResolvedValueOnce({ _id: 1, username: oldUsername }); // old username exists

    mockMeteorUsers.updateAsync.mockResolvedValue({ modifiedCount: 1 });
    mockTransactionsCollection.updateAsync
      .mockResolvedValueOnce(2) // sender
      .mockResolvedValueOnce(1); // receiver

    const method = global.meteorMethods['transactions.updateUser'];
    const result = await method.call({}, oldUsername, newUsername);

    expect(result).toEqual({
      senderTransactionsUpdated: 2,
      receiverTransactionsUpdated: 1,
      totalUpdated: 3,
      userUpdated: true,
    });
  });

  it('transactions.addUser creates a new user', async () => {
    const username = 'newuser';
    
    mockMeteorUsers.findOneAsync.mockResolvedValue(null);
    mockAccounts.createUserAsync.mockResolvedValue('uid');

    const method = global.meteorMethods['transactions.addUser'];
    const result = await method.call({}, username);

    expect(mockMeteorUsers.findOneAsync).toHaveBeenCalledWith({ username });
    expect(mockAccounts.createUserAsync).toHaveBeenCalled();
    expect(result).toBe('uid');
  });
});