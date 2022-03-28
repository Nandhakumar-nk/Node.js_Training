const { Service } = require('feathers-mongoose');

class Users extends Service {
    constructor(options, app) {
        super(options, app);
        this.app = app;
    }

    async create(data, params) {
        console.log("inside user class-----before address creation");
        const addressesResult = await this.app.service("addresses").create(data.addresses, params);

        console.log("inside user class-----after address creation");
        console.log("inside user class,addressResult    ", addressesResult);
        data.user.addresses = addressesResult;
        
        return super.create(data.user, params);
    }
};

module.exports = { Users };