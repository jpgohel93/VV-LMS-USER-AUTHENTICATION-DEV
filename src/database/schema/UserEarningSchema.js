const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserEarningSchema = new Schema({
    code: String,
    user_id: String,
    course_id: String,
    course_amount: Number,
    assign_at: Date,
    course_tax_amount: Number,
    amount: Number,
    user_discount: Number, 
    order_id: String, 
    amount_credited: {
        type: Boolean,
        default: false
    }, 
    payment_under_process: {
        type: Boolean,
        default: false
    }, 
    transaction_id: String,
    transaction_type: Number, // 1. credit, 2. debit
    payment_detail_id: String,
    reason: String
},{ timestamps: true });  

module.exports =  mongoose.model('user_earning', UserEarningSchema);