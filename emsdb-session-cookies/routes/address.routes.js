const express = require("express");

const addressController = require("../controllers/address.controller.js");
const mongoTranscation = require("../db-connection/mongo-transaction.js");

const router = express.Router();

router.use(mongoTranscation.beginSession);

router.get("/getById/:objectId", addressController.getById);

router.get("/getByEmployeeId/:id", addressController.getByEmployeeId);

router.get("/getAll", addressController.getAll);

router.put("/updateById/:objectId", addressController.updateById);

router.delete("/deleteById/:objectId", addressController.deleteById);

router.delete("/deleteByEmployeeId/:id", addressController.deleteByEmployeeId);

router.delete("/deleteAll", addressController.deleteAll);

router.use(mongoTranscation.saveTranscation);

router.use(mongoTranscation.cancelTranscation);

module.exports = router;