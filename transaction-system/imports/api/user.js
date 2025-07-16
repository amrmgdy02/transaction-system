import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const UsersCollection = new Mongo.Collection('users');

const UserSchema = new SimpleSchema({
  username: {
    type: String,
    min: 3,
    max: 20
  },
  // array of transaction IDs
  transactions: {
    type: Array,
    optional: true
  },
  'transactions.$': {
    type: String
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  }
});

UsersCollection.attachSchema(UserSchema);