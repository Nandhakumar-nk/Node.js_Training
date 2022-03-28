const { authenticate } = require('@feathersjs/authentication').hooks;

function registerBeforeHook(context) {
    console.log("before hook--address");
    return context;
};

function registerAfterHook(context) {
    console.log("after hook--address");
    return context;
};

function registerErrorHook(context) {
    console.log("error hook--address");
    return context;
};

module.exports = {
    before: {
        all: [],
        find: [],
        get: [],
        create: [registerBeforeHook],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [registerAfterHook],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [registerErrorHook],
        update: [],
        patch: [],
        remove: []
    }
};