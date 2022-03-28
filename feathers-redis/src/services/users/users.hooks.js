const { authenticate } = require('@feathersjs/authentication').hooks;
//const redisCache = require('feathers-redis-cache');

const {
    hashPassword,
    protect
} = require('@feathersjs/authentication-local').hooks;

function registerBeforeHook(context) {
    console.log("before hook--user");
    return context;
};

function registerAfterHook(context) {
    console.log("after hook--user");
    return context;
};

function registerErrorHook(context) {
    console.log("error hook--user");
    return context;
};

function afterFindHook(context) {
    console.log("----------AFTER FIND HOOK--user");
    return context;
};

function afterGetHook(context) {
    console.log("----------AFTER GET HOOK--user");
    return context;
};

function findUsers(context) {
    console.log("find users");
    const redisClient = context.app.get('redisClient');

    redisClient.get('users', (err, users) => {
        console.log("redis users", users);
        if (err) throw err;

        context.usersCache = (users != null) ? true : false;
        if (users != null) {
            console.log("setting result from cache--users");
            context.result = JSON.parse(users);
        }
    });


    return context;
};

function cacheUsers(context) {
    let users = context.result;

    if ((users != null) && !(context.usersCache)) {
        console.log("cache users");
        const redisClient = context.app.get('redisClient');

        console.log("setting result to cache--users");
        redisClient.set('users', JSON.stringify(users), (err, status) => {
            if (err) throw err;
            console.log("saved users", status);
        });

    }
    return context;
};

function findUser(context) {
    console.log("find user");
    const redisClient = context.app.get('redisClient');

    redisClient.get(context.id, (err, user) => {
        console.log("redis user", user);
        if (err) throw err;

        context.userCache = (user != null) ? true : false;
        if (user != null) {
            console.log("setting result from cache--user");
            context.result = JSON.parse(user);
        }
    });

    return context;
};

function cacheUser(context) {
    let user = context.result;

    if ((user != null) && !(context.userCache)) {
        console.log("cache user");
        const redisClient = context.app.get('redisClient');

        console.log("setting result to cache--user");
        redisClient.set(String(user._id), JSON.stringify(user), (err, status) => {
            if (err) throw err;
            console.log("saved user", status);
        });

    }
    return context;
};

function deleteUsers(context) {
    console.log("delete users");
    const redisClient = context.app.get('redisClient');
    let user = context.result;

    if (user != null) {
        console.log("deleting the users from cache--users");

        redisClient.del('users', function(err, reply) {
            if (err) throw err;
            console.log("deleted users", reply);
        });

    }
    return context;
};

function deleteUser(context) {
    console.log("delete user");
    const redisClient = context.app.get('redisClient');
    let user = context.result;

    if (user != null) {
        console.log("deleting the user from cache--users");

        redisClient.del(String(user._id), function(err, reply) {
            if (err) throw err;
            console.log("deleted user", reply);
        });

    }
    return context;
};

module.exports = {
    before: {
        all: [],
        //find: [redisCache.hooks.before()],
        find: [findUsers],
        //get: [redisCache.hooks.before()],
        get: [findUser],
        create: [hashPassword('user.password'), registerBeforeHook],
        update: [hashPassword('password'), authenticate('jwt')],
        patch: [hashPassword('password'), authenticate('jwt')],
        remove: [authenticate('jwt')]
    },

    after: {
        all: [
            // Make sure the password field is never sent to the client
            // Always must be the last hook
            protect('password')
        ],
        //find: [afterFindHook, redisCache.hooks.after()],
        find: [afterFindHook, cacheUsers],
        //get: [afterGetHook, redisCache.hooks.after()],
        get: [afterGetHook, cacheUser],
        create: [registerAfterHook, cacheUser, deleteUsers],
        update: [cacheUser, deleteUser, deleteUsers],
        patch: [cacheUser, deleteUser, deleteUsers],
        remove: [cacheUser, deleteUser, deleteUsers]
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [registerErrorHook]
    }
};