const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./config/database.config");
const employeeRoutes = require("./routes/employee.routes");
//const MongoClient = require("mongodb").MongoClient;
const app = express();
let database;
let employeesCollection;

app.listen(3000, function() {
    console.log("listening on 3000");
});

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
    .connect(dbConfig.url, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/employee", employeeRoutes);

app.get("/", (req, res) => {
    res.send("Hello World new 1");
});