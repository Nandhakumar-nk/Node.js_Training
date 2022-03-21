const express = require("express");

const authcontroller = require("../auth/auth.controller.js");
const employeeController = require("../controllers/employee.controller.js");
const mongoTranscation = require("../db-connection/mongo-transaction.js");

const router = express.Router();

router.use(authcontroller.verifyToken);

router.use(mongoTranscation.beginSession);

router.post("/create", employeeController.create);

router.post("/createFromXlsx", employeeController.createFromXlxs);

router.post("/login", employeeController.login);

router.get("/getById/:id", employeeController.getById);

router.get("/getAll", employeeController.getAll);

router.put("/updateById/:id", employeeController.updateById);

router.patch("/changePassword", employeeController.changePassword);

router.delete("/deleteById", employeeController.deleteById);

router.delete("/deleteAll", employeeController.deleteAll);

router.delete("/logout", employeeController.logout);

router.use(mongoTranscation.saveTranscation);

router.use(mongoTranscation.cancelTranscation);

module.exports = router;