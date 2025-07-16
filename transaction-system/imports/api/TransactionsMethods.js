import {Meteor} from 'meteor/meteor';
// I want to make insert and remove methods for transactions
import {check} from 'meteor/check';
import { TransactionsCollection } from './transaction';

Meteor.methods({
  'transactions.insert'(transaction) {
    check(transaction, {
      userId: String,
      amount: Number,
      type: String,
      createdAt: Date
    });

    // Insert the transaction into the collection
    TransactionsCollection.insert(transaction);
  },

  'transactions.remove'(transactionId) {
    check(transactionId, String);
    TransactionsCollection.remove(transactionId);
  }
});