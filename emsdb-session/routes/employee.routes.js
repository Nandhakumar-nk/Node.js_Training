const express = require("express");

const employeeController = require("../controllers/employee.controller.js");
const mongoTranscation = require("../db-connection/mongo-transaction.js");

const router = express.Router();

router.use(mongoTranscation.beginSession);

router.post("/create", employeeController.create);

router.post("/createFromXlsx", employeeController.createFromXlxs);

router.get("/getById/:id", employeeController.getById);

router.get("/getAll", employeeController.getAll);

router.put("/updateById/:id", employeeController.updateById);

router.delete("/deleteById/:id", employeeController.deleteById);

router.delete("/deleteAll", employeeController.deleteAll);

router.use(mongoTranscation.saveTranscation);

router.use(mongoTranscation.cancelTranscation);

module.exports = router;