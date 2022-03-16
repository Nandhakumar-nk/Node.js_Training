const mongoose = require("mongoose");

const dbConfig = require("./config/database.configs.js");

mongoose.Promise = global.Promise;

const dbConnection = {
    session: undefined,
    connect: function() {
        mongoose.connect(dbConfig.url, {
                useNewUrlParser: true,
            })
            .then(() => {
                console.log("Successfully connected to the database");
            })
            .catch((err) => {
                console.log("Could not connect to the database. Exiting now...", err);
                process.exit();
            });
    },
    getSession: async() => {
        if (undefined === this.session || this.session.hasEnded) {
            session = await mongoose.startSession();
        }
        return this.session;
    },
    endSession: () => {
        this.session.endSession();
    }
}

module.exports = dbConnection;