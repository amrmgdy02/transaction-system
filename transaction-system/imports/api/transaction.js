import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const TransactionsCollection = new Mongo.Collection('transactions');

export const TransactionSchema = new SimpleSchema({
    senderUsername: {
        type: String,
    },
    receiverUsername: {
        type: String,
    },
    amount: {
        type: Number,
        min: 0
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