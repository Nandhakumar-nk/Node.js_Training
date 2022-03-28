const transcation = require('./transaction/mongo-transaction.js');
const TransactionManager = require('feathers-mongoose').TransactionManager;
const isTransactionEnable = process.env.TRANSACTION_ENABLE || false;
const skipPath = ['login'];

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [transcation.beginSession],
        update: [(isTransactionEnable, async hook =>
            TransactionManager.beginTransaction(hook, skipPath)
        )],
        patch: [(isTransactionEnable, async hook =>
            TransactionManager.beginTransaction(hook, skipPath)
        )],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [transcation.saveTranscation],
        update: [(isTransactionEnable, async() => { await TransactionManager.commitTransaction; })],
        patch: [(isTransactionEnable, async() => { await TransactionManager.commitTransaction; })],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [transcation.cancelTranscation],
        update: [(isTransactionEnable, async() => { await TransactionManager.rollbackTransaction; })],
        patch: [(isTransactionEnable, async() => { await TransactionManager.rollbackTransaction; })],
        remove: []
    }
};