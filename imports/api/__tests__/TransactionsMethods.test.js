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
