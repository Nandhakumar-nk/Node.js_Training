const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')
const express = require("express");
const mongoose = require("mongoose");

const dbConfig = require("./config/database.config.js");
const employeeRoutes = require("./routes/employee.routes.js");
const addressRoutes = require("./routes/address.routes.js");

const app = express();

app.listen(3001, function() {
    console.log("listening on 3001");
});

mongoose.Promise = global.Promise;
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

app.get("/getMessage", (req, res) => {
    res.send("Message sent from server.js");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/employee", employeeRoutes);
app.use("/address", addressRoutes);
app.get("/", (req, res) => {
    res.send("Empty get request received");
});