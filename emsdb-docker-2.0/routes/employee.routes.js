const express = require("express");
const xlsx = require("xlsx");
const fs = require("fs");
const Employee = require("../models/employee.model");
const router = express.Router();

router.post("/create", function(req, res) {
    let employee = new Employee(req.body);

    employee.save(function(err) {
        if (err) {
            console.log("Employee create Error");
            console.log(err);
            return err;
        }
        res.send("Employee created");
    });
});

router.post("/createFromXlsx", function(req, res) {
    let results = [];
    const workBook = xlsx.readFile("./employees.xlsx", { dateNF: "dd/mm/yy" });

    for (let sheetNumber = 0; sheetNumber < workBook.SheetNames.length; sheetNumber++) {
        const workSheet = workBook.Sheets[workBook.SheetNames[sheetNumber]];
        let employees = xlsx.utils.sheet_to_json(workSheet, { raw: false });

        employees = employees.map((employee) => {
            if (typeof(employee.id) == 'string') employee.id = Number(employee.id);
            if (typeof(employee.mobile) == 'string') employee.mobile = Number(employee.mobile);
            return employee;
        });

        fs.appendFile("./employees.json", JSON.stringify(employees, null, 2), (err) => {
            if (err)
                console.log(err);
            else {
                console.log("employee appended successfully\n");
            }
        });
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
});

router.get("/getById/:id", function(req, res) {
    Employee.find({ id: req.params.id }).then(function(employee) {
        if (employee.length === 0) {
            res.send("Employee not found for the id:" + req.params.id);
        } else {
            res.send(employee);
        }
    }).catch((err) => {
        res.send("Employee getById Error");
        console.log(err);
    });
});

router.get("/getAll", function(req, res) {
    Employee.find({}).then(function(employees) {
        res.send(employees);
    }).catch((err) => {
        console.log("Employee getAll Error");
        console.log(err);
    });
});

router.put("/updateById/:id", function(req, res) {
    Employee.updateOne({ id: req.params.id }, { $set: req.body }).then(function(employee) {
        console.log("Employee updated");
        res.send(employee);
    }).catch((err) => {
        console.log("Employee updateById Error");
        console.log(err);
    });
});

router.delete("/deleteById/:id", function(req, res) {
    Employee.deleteOne({ id: req.params.id }).then(function(employee) {
        console.log("Employee deleted");
        res.send(employee);
    }).catch((err) => {
        console.log("Employee deleteById Error");
        console.log(err);
    });
});

router.delete("/deleteAll", function(req, res) {
    Employee.deleteMany({}).then(function(employee) {
        console.log("Employees deleted");
        res.send(employee);
    }).catch((err) => {
        console.log("Employee deleteAll Error");
        console.log(err);
    });
});

module.exports = router;