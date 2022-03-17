const { default: mongoose } = require("mongoose");
const Address = require("../models/address.model.js");

const addressController = {
    create: async(req, res, employeeObjectId) => {
        console.log("employee object id" + req.employeeObjectId);
        let message;
        let addressObjects = [];

        try {
            for (let address of req.body.addresses) {
                addressObjects.push(new Address({
                    "house_number": address.house_number,
                    "street_name": address.street_name,
                    "area": address.area,
                    "pincode": address.pincode,
                    "district": address.district,
                    "employee": req.employeeObjectId
                }));
            }
            await Address.insertMany(addressObjects, { session: req.addedSession });
        } catch (error) {
            console.log("Address Create Error from catch!");
            message = "Address create error from catch!";
            throw error;
        }
    },

    getById: async function(req, res) {
        let message;

        try {
            const address = await Address.findOne({ id: req.params.objectId }).session(req.addedSession);

            if (address === null) {
                message = "Address not found for the id:" + req.params.id;
            } else {
                message = address;
            }
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while getting Address by id!";
        }

        if (!res.headersSent) res.send(message);
    },

    getByEmployeeId: async function(req, res) {
        let message;

        try {
            const addresses = await Address.find({ employee: req.params.id }).session(req.addedSession);

            if (addresses.length === 0) {
                message = "Addresses not found for the employee id:" + req.params.id;
            } else {
                message = addresses;
            }
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while getting Address by employee id!";
        }

        if (!res.headersSent) res.send(message);
    },

    getAll: async function(req, res) {
        let message;

        try {
            const addresses = await Address.find().session(req.addedSession);

            if (addresses.length === 0) {
                message = "Addresses storage is empty!"
            } else {
                message = addresses;
            }
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while getting all addresses!"
        }

        if (!res.headersSent) res.send(message);
    },

    updateById: async function(req, res) {
        let message;

        try {
            message = await Address.updateOne({ id: req.params.objectId }, { $set: req.body }, { session: req.addedSession });
            message = "Address successfully updated by id";
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while updating address by id!";
        }

        if (!res.headersSent) res.send(message);
    },

    deleteById: async function(req, res) {
        let message;

        try {
            await Address.deleteOne({ id: req.params.objectId }, { session: req.addedSession });
            message = "Address successfully deleted by id";
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while deleting address by id!";
        }

        if (!res.headersSent) res.send(message);
    },

    deleteByEmployeeId: async function(req, res) {
        let message;

        try {
            await Address.deleteMany({ employee: req.params.id }, { session: req.addedSession });
            message = "Addresses successfully deleted by employee id";
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while deleting addresses by employee id!";
        }

        if (!res.headersSent) res.send(message);
    },

    deleteAll: async function(req, res) {
        let message;

        try {
            await Address.deleteMany({}, { session: req.addedSession });
            message = "Addresses successfully deleted";
            await next();
        } catch (error) {
            await next(error);
            message = "Error faced while deleting all addresses!";
        }

        if (!res.headersSent) res.send(message);
    }
}

module.exports = addressController;