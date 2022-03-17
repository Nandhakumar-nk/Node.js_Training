const fs = require("fs");
const xlsx = require("xlsx");

const Address = require("../models/address.model.js");
const addressController = require("./address.controller.js");
const Employee = require("../models/employee.model.js");

const employeeController = {
    create: async(req, res, next) => {
        console.log("session" + req.addedSession);
        console.log("testKey====" + req.testKey);

        let message;
        const session = req.addedSession;

        try {
            let employee = new Employee({
                id: req.body.id,
                name: req.body.name,
                emailID: req.body.emailID,
                mobile: req.body.mobile,
            });

            const result = await Employee.create([employee], { session: session });

            req.employeeObjectId = employee._id;
            await addressController.create(req, res);
            console.log("returned from address commited");
            await next();
            message = "Employee created with address from employee controller";
            console.log("After next");
        } catch (error) {
            console.log("Employee Create Error from catch");
            await next(error);
            message = "Employee Create Error from catch!";
        }

        if (!res.headersSent) res.send(message);
    },

    createFromXlxs: async function(req, res, next) {
        let message;
        //let session;
        let allEmployees = [];

        try {
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

                //this.appendFiles(employees);
                allEmployees = allEmployees.concat(employees);
            }
            console.log("for loop completed");
            message = await Employee.collection.insertMany(allEmployees, { session: req.addedSession });
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while inserting many employees from xlxs file!";
        }

        if (!res.headersSent) res.send(message);
    },

    appendFiles: function(employees) {
        fs.appendFile(
            "./employees.json",
            JSON.stringify(employees, null, 2),
            (err) => {
                if (err) console.log(err);
                else {
                    console.log("employees appended successfully\n");
                }
            }
        );
    },

    getById: async function(req, res, next) {
        let message;
        //let session;

        try {

            const employee = await Employee.findOne({ id: req.params.id }).session(req.addedSession);

            if (employee === null) {
                message = "Employee not found for the id:" + req.params.id;
            } else {
                const addresses = await Address.find({ employee: employee._id }).session(req.addedSession);

                message = {
                    "employeeDetails": employee,
                    "addresses": addresses
                };
            }
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while getting Employee by id!";
        }

        if (!res.headersSent) res.send(message);
    },

    getAll: async function(req, res, next) {
        let message;
        let allEmployees = [];
        //let session;

        try {
            const employees = await Employee.find().session(req.addedSession);

            if (employees.length === 0) {
                message = "Employees storage is empty!"
            } else {
                for (let employee of employees) {
                    const addresses = await Address.find({ employee: employee._id }).session(req.addedSession);

                    allEmployees.push({
                        "employeeId": employee.id,
                        "employeeDetails": employee,
                        "addresses": addresses
                    });
                }
                message = allEmployees;
            }
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while getting all employees!";
        }

        if (!res.headersSent) res.send(message);
    },

    updateById: async function(req, res, next) {
        let message;

        try {
            message = await Employee.updateOne({ id: req.params.id }, { $set: req.body }, { session: req.addedSession });
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while updating employee by id!";
        }

        res.send(message);
    },

    deleteById: async function(req, res, next) {
        let message;
        //let session;

        try {
            const employee = await Employee.findOne({ id: req.params.id }).session(req.addedSession);

            await Address.deleteMany({ "employee": employee._id }, { session: req.addedSession });
            await Employee.deleteOne({ id: req.params.id }, { session: req.addedSession });
            await next();
            message = "Employees successfully deleted";
        } catch (error) {
            await next(error);
            message = "Error faced while deleting employee by id!";
        }

        if (!res.headersSent) res.send(message);
    },

    deleteAll: async function(req, res, next) {
        let message;
        //let session;

        try {
            await Address.deleteMany({}, { session: req.addedSession });
            await Employee.deleteMany({}, { session: req.addedSession });
            message = "Employees successfully deleted";
            await next();

        } catch (error) {
            await next(error);
            message = "Error faced while deleting all employees!"
        }

        if (!res.headersSent) res.send(message);
    }
};

module.exports = employeeController;