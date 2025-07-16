import { Meteor } from 'meteor/meteor';
import { TransactionsCollection } from './transaction';

Meteor.publish('transactions', async function transactionsPublication() {
  if (!this.userId) {
    return this.ready();
  }
  
  const user = await Meteor.users.findOneAsync(this.userId);
  const username = user?.username;
  if (!username) {
    return this.ready();
  }
  
  return TransactionsCollection.find({ 
    $or: [
      { senderUsername: username }, 
      { receiverUsername: username }
    ] 
  });
});