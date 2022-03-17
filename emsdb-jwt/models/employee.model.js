const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    emailID: {
        type: String,
        unique: true,
    },
    mobile: {
        type: Number,
        required: true,
    }
    /*addresses: [{
        type: Schema.Types.ObjectId,
        ref: "Address"
    }]*/
});

// Export model
module.exports = mongoose.model("Employee", employeeSchema);