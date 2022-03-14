const express = require("express");
const dbConfig = require("./config/database.config");
const employeeRoutes = require("./routes/employee.routes");
const bodyParser = require("body-parser");
const app = express();

app.listen(3001, function() {
    console.log("listening on 3001");
});

app.get("/getMessage", (req, res) => {
    res.send("Message sent from server.js");
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
    res.send("Empty get request received");
});