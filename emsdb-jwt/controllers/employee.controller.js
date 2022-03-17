const fs = require("fs");
const bcrypt = require('bcryptjs');
const xlsx = require("xlsx");

const Address = require("../models/address.model.js");
const authcontroller = require("../auth/auth.controller.js");
const addressController = require("./address.controller.js");
const Employee = require("../models/employee.model.js");

const employeeController = {
    create: async(req, res, next) => {
        let result;
        const session = req.addedSession;

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 8);
            let employee = new Employee({
                id: req.body.id,
                password: hashedPassword,
                name: req.body.name,
                emailID: req.body.emailID,
                mobile: req.body.mobile,
            });
            result = await Employee.create([employee], { session: session });

            req.employeeObjectId = result._id;
            await addressController.create(req, res);
            await next();
            const token = await authcontroller.generateToken(employee);

            console.log("token:" + token);
            result = { "token": token };
        } catch (error) {
            console.log("Employee Create Error from catch");
            await next(error);
            result = "Employee Create Error from catch!";
        }

        if (!res.headersSent) res.send(result);
    },

    createFromXlxs: async function(req, res, next) {
        let message;
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

    login: async function(req, res, next) {
        let result;

        try {
            const employee = await Employee.findOne({ id: req.params.emailId }).session(req.addedSession);

            if (employee) {
                if (await bcrypt.compare(req.params.password, employee.password)) {
                    const token = authcontroller.generateToken(employee);

                    result = { "token": token };
                } else {
                    result = "Employee Password is invalid";
                }
            } else {
                result = "Employee emailId is invalid";
            }
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while getting Employee by id!";
        }

        if (!res.headersSent) res.send(result);
    },

    getById: async function(req, res, next) {
        let message;

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