import { Meteor } from 'meteor/meteor';
import { TransactionsCollection } from './transaction';

Meteor.publish('transactions', function transactionsPublication() {
  if (!this.userId) {
    return this.ready();
  }
  
  const username = Meteor.users.findOne(this.userId)?.username;
  if (!username) {
    return this.ready();
  }
  
  // Find transactions where user is either sender or receiver
  return TransactionsCollection.find({ 
    $or: [
      { senderUsername: username }, 
      { receiverUsername: username }
    ] 
  });
});