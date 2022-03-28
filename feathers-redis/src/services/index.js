const users = require('./users/users.service.js');
const addresses = require('./addresses/addresses.service.js');
const redisCache = require('feathers-redis-cache');


// eslint-disable-next-line no-unused-vars
module.exports = function(app) {
    console.log("index.js--------services");
    app.configure(users);
    app.configure(addresses);
    app.configure(redisCache.client());
    app.configure(redisCache.services({ pathPrefix: '/users' }));
    app.configure(redisCache.services({ pathPrefix: '/addresses' }))
};