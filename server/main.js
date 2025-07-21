import { Meteor } from 'meteor/meteor';
import '../imports/api/TransactionsMethods.js';
import '../imports/api/TransactionsPublications.js';

Meteor.startup(async () => {
  console.log('Server started successfully!');
});
