const Address = require("../models/address.model.js");

const addressController = {
    create: async(req, res, employeeObjectId, session) => {
        try {
            for (let address of req.body.addresses) {
                const addressObject = new Address({
                    "house_number": address.house_number,
                    "street_name": address.street_name,
                    "area": address.area,
                    "pincode": address.pincode,
                    "district": address.district,
                    "employee": employeeObjectId
                });
                await Address.create([addressObject], { session: session });
            }
        } catch (error) {
            console.log("Address Create Error from catch");
            console.log("Error occured--" + error);
            throw error;
        }
    }
}

module.exports = addressController;