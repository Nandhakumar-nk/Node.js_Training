const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    emailID: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    }
});

// Export model
module.exports = mongoose.model("Employee", employeeSchema);