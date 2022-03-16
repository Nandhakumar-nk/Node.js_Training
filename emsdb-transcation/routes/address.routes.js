const express = require("express");
const mongoose = require("mongoose");
const addressController = require("../controllers/address.controller.js");
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

router.post("/create", addressController.create);

router.get("/getById/:objectId", addressController.getById);

router.get("/getByEmployeeId/:id", addressController.getByEmployeeId);

router.get("/getAll", addressController.getAll);

router.put("/updateById/:objectId", addressController.updateById);

router.delete("/deleteById/:objectId", addressController.deleteById);

router.delete("/deleteByEmployeeId/:id", addressController.deleteByEmployeeId);

router.delete("/deleteAll", addressController.deleteAll);

module.exports = router;