const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentDetailSchema = new Schema({
    user_id: String,
    account_holder_name: String,
    branch_name: String,
    bank_name: String,
    ifsc_code: String,
    account_number: String,
    branch_code: String,
    status: {
        type: Boolean,
        default: true
    }, 
    is_deleted: {
        type: Boolean,
        default: false
    }
},{ timestamps: true }); 

module.exports =  mongoose.model('payment_detail', PaymentDetailSchema);