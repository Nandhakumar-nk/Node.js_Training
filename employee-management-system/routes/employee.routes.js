const express = require("express");
const Employee = require("../models/employee.model");
const router = express.Router();

router.post("/create", function(req, res) {
    let employee = new Employee(req.body);

    employee.save(function(err) {
        if (err) {
            console.log("Error---------");
            console.log(err);
            return err;
        }
        console.log("Employee Created successfully");
        res.send("Employee Created successfully");
    });
});

router.get("/get/:id", function(req, res) {
    Employee.findById(req.params.id, function(err, employee) {
        if (err) {
            console.log("Error---------");
            console.log(err);
            return err;
        }
        res.send(employee);
    });
});

router.get("/getAll", function(req, res) {
    Employee.find({}).then(function(employees) {
        res.send(employees);
    }).catch((err) => {
        console.log(err);
    });
});

router.put("/update/:id", function(req, res) {
    Employee.findByIdAndUpdate(
        req.params.id, { $set: req.body },
        function(err, employee) {
            if (err) {
                console.log("Error---------");
                console.log(err);
                return err;
            }
            console.log("Employee updated");
            res.send(employee);
        }
    );
});

router.delete("/delete/:id", function(req, res) {
    Employee.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log("Error---------");
            console.log(err);
            return err;
        }
        res.send("Deleted successfully!");
    });
});

module.exports = router;