const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawOrdersSchema = new Schema({
    state: { // pending, approved, rejected
        type: String,
        required: true,
        default: "pending"
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, { timestamps: true });

const WithdrawOrders = mongoose.model('WithdrawOrders', withdrawOrdersSchema);
module.exports = WithdrawOrders;
