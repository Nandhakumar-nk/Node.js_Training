const { default: mongoose } = require("mongoose");
const Address = require("../models/address.model.js");

const addressController = {
    create: async(req, res, session, employeeObjectId, ) => {
        let message;
        let addressObjects = [];
        let responseNeeded = false;

        try {
            if (session === undefined) {
                session = await mongoose.startSession();
            }

            if (employeeObjectId === undefined) {
                employeeObjectId = req.params.employeeObjectId;
                responseNeeded = true;
            }

            for (let address of req.body.addresses) {
                addressObjects.push(new Address({
                    "house_number": address.house_number,
                    "street_name": address.street_name,
                    "area": address.area,
                    "pincode": address.pincode,
                    "district": address.district,
                    "employee": employeeObjectId
                }));
            }

            await session.withTransaction(async() => {
                message = await Address.insertMany(addressObjects, { session: session });
            });
            this.sendResponse(res, responseNeeded, message);
        } catch (error) {
            console.log("Address Create Error from catch!");
            console.log("Error occured--" + error);
            message = "Address create error from catch";
            this.sendResponse(session, res, responseNeeded, message);
            throw error;
        }
    },

    sendResponse: function(session, res, responseNeeded, message) {
        if (responseNeeded) {
            session.endSession();
            res.send(message);
        }
    },

    getById: async function(req, res) {
        let message;
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                const address = await Address.findOne({ id: req.params.objectId }).session(session);

                if (address === null) {
                    message = "Address not found for the id:" + req.params.id;
                } else {
                    message = address;
                }
            });
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while getting Address by id!";
        } finally {
            await session.endSession();
        }
        res.send(message);
    },

    getByEmployeeId: async function(req, res) {
        let message;
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                const addresses = await Address.find({ employee: req.params.id }).session(session);

                if (addresses.length === 0) {
                    message = "Addresses not found for the employee id:" + req.params.id;
                } else {
                    message = addresses;
                }
            });
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while getting Address by employee id!";
        } finally {
            await session.endSession();
        }
        res.send(message);
    },

    getAll: async function(req, res) {
        let message;
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                const addresses = await Address.find().session(session);

                if (addresses.length === 0) {
                    message = "Addresses storage is empty!"
                } else {
                    message = addresses;
                }
            });
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while getting all addresses!"
        } finally {
            await session.endSession();
        }
        res.send(message);
    },

    updateById: async function(req, res) {
        let message;

        try {
            message = await Address.updateOne({ id: req.params.objectId }, { $set: req.body });
            message = "Address successfully updated by id";
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while updating address by id!";
        }

        res.send(message);
    },

    deleteById: async function(req, res) {
        let message;
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                await Address.deleteOne({ id: req.params.objectId }, { session: session });
                message = "Address successfully deleted by id";
            });
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while deleting address by id!";
        } finally {
            await session.endSession();
        }
        res.send(message);
    },

    deleteByEmployeeId: async function(req, res) {
        let message;
        let session;

        try {
            session = await mongoose.startSession();
            await session.withTransaction(async() => {
                await Address.deleteMany({ employee: req.params.id }, { session: session });
                message = "Addresses successfully deleted by employee id";
            });
        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while deleting addresses by employee id!";
        } finally {
            await session.endSession();
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
                message = "Addresses successfully deleted";
            });

        } catch (error) {
            console.log("Error faced--" + error);
            message = "Error faced while deleting all addresses!";
        } finally {
            await session.endSession();
        }
        res.send(message);
    }
}

module.exports = addressController;