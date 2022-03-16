const express = require("express");
const mongoose = require("mongoose");
const employeeController = require("../controllers/employee.controller.js");
const router = express.Router();

async function getSession(res) {
    let session;

    try {
        session = await mongoose.startSession();
    } catch (error) {
        console.log("Error faced: " + error);
        //res.send("Error faced while starting the session")
    }
    return session;
}

router.post("/create", employeeController.create);

router.post("/createFromXlsx", employeeController.createFromXlxs);

router.get("/getById/:id", employeeController.getById);

router.get("/getAll", employeeController.getAll);

router.put("/updateById/:id", employeeController.updateById);

router.delete("/deleteById/:id", employeeController.deleteById);

router.delete("/deleteAll", employeeController.deleteAll);

module.exports = router;