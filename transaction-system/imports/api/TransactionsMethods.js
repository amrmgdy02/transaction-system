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
      receiverUsername: String,
      amount: Number,
    });
    const insertedTransaction = {
      ...transaction,
      senderUsername: await getUsername(this.userId),
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
      receiverUsername: String,
      amount: Number,
    });

    const { _id, receiverUsername, amount } = transaction;
    return await TransactionsCollection.updateAsync(_id, {
      $set: { receiverUsername, amount },
    });
  },
});