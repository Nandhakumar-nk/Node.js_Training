const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema = new Schema({
    house_number: {
        type: Number,
        unique: true
    },
    street_name: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee"
    }
});

// Export model
module.exports = mongoose.model("Address", addressSchema);