const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email_id: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: Number
    }
});

// Export model
module.exports = mongoose.model("Employee", employeeSchema);