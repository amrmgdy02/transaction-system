import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import { TransactionsCollection } from './transaction';

const getUsername = async (userId) => {
  const user = await Meteor.users.findOneAsync(userId);
  return user ? user.username : null;
};

Meteor.methods({
  async 'transactions.insert'(transaction) {
    check(transaction, {
      senderUsername: String,
      receiverUsername: String,
      amount: Number,
      createdAt: Date,
    });
    const insertedTransaction = {
      accountantUsername: await getUsername(this.userId),
      ...transaction,
    };
    return await TransactionsCollection.insertAsync(insertedTransaction);
  },

  async 'transactions.remove'(transactionId) {
    check(transactionId, String);
    return await TransactionsCollection.removeAsync(transactionId);
  },

  async 'transactions.update'(transaction) {
    check(transaction, {
      _id: String,
      senderUsername: String,
      receiverUsername: String,
      amount: Number,
      createdAt: Date,
    });
    const accountantUsername = await getUsername(this.userId);
    const { _id, receiverUsername, amount, createdAt } = transaction;
    return await TransactionsCollection.updateAsync(_id, {
      $set: { accountantUsername, receiverUsername, amount, createdAt },
    });
  },

  async 'transactions.getUserBalance'(username) {
    check(username, String);
    
    const receivedTransactions = await TransactionsCollection.find({ 
      receiverUsername: username 
    }).fetchAsync();
    const totalReceived = receivedTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const sentTransactions = await TransactionsCollection.find({ 
      senderUsername: username 
    }).fetchAsync();

    const totalSent = sentTransactions.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalReceived - totalSent;
    
    return {
      username: username,
      balance: balance,
      totalReceived: totalReceived,
      totalSent: totalSent
    };
  },

  async 'transactions.getAllUserNames'() {
    const users = await Meteor.users.find({}, { fields: { username: 1 } }).fetchAsync();
    return users.map(user => user.username);
  },

  async 'transactions.getBalancesList'() {
    const transactions = TransactionsCollection.find({}).fetch();
    const allUsernames = new Set();
    transactions.forEach(transaction => {
    allUsernames.add(transaction.senderUsername);
    allUsernames.add(transaction.receiverUsername);
    });
    const uniqueUsernames = Array.from(allUsernames);
          
    const userBalances = uniqueUsernames.map(username => {
      const totalReceived = transactions
      .filter(t => t.receiverUsername === username)
      .reduce((sum, t) => sum + t.amount, 0);
      
      const totalSent = transactions
      .filter(t => t.senderUsername === username)
      .reduce((sum, t) => sum + t.amount, 0);
      
      return {
      username: username,
      balance: totalReceived - totalSent,
      totalReceived: totalReceived,
      totalSent: totalSent
      };
    });
  return userBalances;
}
});