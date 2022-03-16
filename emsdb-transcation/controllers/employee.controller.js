const fs = require("fs");
const mongoose = require("mongoose");
const xlsx = require("xlsx");

const Address = require("../models/address.model.js");
const addressController = require("./address.controller.js");
const Employee = require("../models/employee.model.js");

const employeeController = {
    create: async(req, res) => {
        let message;
        let session;

        try {
            session = await mongoose.startSession();

            await session.withTransaction(async() => {
                const employee = new Employee({
                    id: req.body.id,
                    name: req.body.name,
                    emailID: req.body.emailID,
                    mobile: req.body.mobile,
                });

                await Employee.create([employee], { session: session });
                await addressController.create(req, res, employee._id, session);
            });
            console.log("returned from address commited");
            message = "Employee created with address from employee controller";
        } catch (error) {
            console.log("Employee Create Error from catch");
            console.log("Error occured--" + error);
            message = "Employee Create Error from catch";
        } finally {
            session.endSession();
        }

        res.send(message);
    },

    createFromXlxs: function(req, res) {
        let results = [];
        const workBook = xlsx.readFile("./employees.xlsx", { dateNF: "dd/mm/yy" });

        for (
            let sheetNumber = 0; sheetNumber < workBook.SheetNames.length; sheetNumber++
        ) {
            const workSheet = workBook.Sheets[workBook.SheetNames[sheetNumber]];
            let employees = xlsx.utils.sheet_to_json(workSheet, { raw: false });

            employees = employees.map((employee) => {
                if (typeof employee.id == "string") employee.id = Number(employee.id);
                if (typeof employee.mobile == "string")
                    employee.mobile = Number(employee.mobile);
                return employee;
            });

            fs.appendFile(
                "./employees.json",
                JSON.stringify(employees, null, 2),
                (err) => {
                    if (err) console.log(err);
                    else {
                        console.log("employee appended successfully\n");
                    }
                }
            );
            Employee.collection.insertMany(employees, function(err, result) {
                if (err) {
                    console.log("Employee createFromXlsx Error");
                    return console.error(err);
                } else {
                    results.push(result);
                    console.log("Multiple documents inserted to Collection");
                }
            });
            //if (sheetNumber == workBook.SheetNames.length - 1) res.send(results);
        }
        console.log("for loop completed");
        res.send(results);
    },
    getById: async function(req, res) {
        let message;
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                const employee = await Employee.findOne({ id: req.params.id }).session(session);

                if (employee === null) {
                    message = "Employee not found for the id:" + req.params.id;
                } else {
                    const addresses = await Address.find({ employee: employee._id }).session(session);

                    message = {
                        "employeeDetails": employee,
                        "addresses": addresses
                    };
                }
            });
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while getting Employee"
        } finally {
            await session.endSession()
        }
        res.send(message);
    },
    getAll: async function(req, res) {
        let message;
        let allEmployees = [];
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                const employees = await Employee.find().session(session);

                if (employees.length === 0) {
                    message = "Employees storage is empty!"
                } else {
                    for (let employee of employees) {
                        const addresses = await Address.find({ employee: employee._id }).session(session);

                        allEmployees.push({
                            "employeeId": employee.id,
                            "employeeDetails": employee,
                            "addresses": addresses
                        });
                    }
                    message = allEmployees;
                }
            });
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while getting all employees"
        } finally {
            await session.endSession()
        }
        res.send(message);
    },
    updateById: function(req, res) {
        Employee.updateOne({ id: req.params.id }, { $set: req.body })
            .then(function(employee) {
                console.log("Employee updated");
                res.send(employee);
            })
            .catch((err) => {
                console.log("Employee updateById Error");
                console.log(err);
            });
    },
    deleteById: async function(req, res) {
        let message;
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                const employee = await Employee.findOne({ id: req.params.id }).session(session);
                await Address.deleteMany({ "employee": employee._id }, { session: session });
                await Employee.deleteOne({ id: req.params.id }, { session: session });
                message = "Employees successfully deleted";
            });
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while deleting employee"
        } finally {
            await session.endSession()
        }
        res.send(message);
    },
    deleteAll: async function(req, res) {
        let message;
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                await Address.deleteMany({}, { session: session });
                await Employee.deleteMany({}, { session: session });
                message = "Employees successfully deleted";
            });

        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while deleting all employees"
        } finally {
            await session.endSession()
        }
        res.send(message);
    }
};

module.exports = employeeController;