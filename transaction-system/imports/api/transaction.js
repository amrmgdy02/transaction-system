import { Mongo } from 'meteor/mongo';

export const TransactionsCollection = new Mongo.Collection('transactions');

const TransactionSchema = new SimpleSchema({
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

TransactionsCollection.attachSchema(TransactionSchema);