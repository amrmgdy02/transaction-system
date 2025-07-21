import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const TransactionsCollection = new Mongo.Collection('transactions');

export const TransactionSchema = new SimpleSchema({
    accountantUsername: {
        type: String,
    },
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
    createdA: {
        type: Date,
    },
});