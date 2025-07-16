import { Meteor } from 'meteor/meteor';
import { TransactionsCollection } from '/imports/api/TransactionsCollection';

Meteor.publish('transactions', function transactionsPublication() {
  if (!this.userId) {
    return this.ready();
  }
  const username = Meteor.users.findOne(this.userId)?.username;
    if (!username) {
        return this.ready();
    }
  return TransactionsCollection.find({ $or: [{ sender: username }, { receiver: username }] });
});