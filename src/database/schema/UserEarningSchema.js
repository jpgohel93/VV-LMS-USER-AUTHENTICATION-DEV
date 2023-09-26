const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserEarningSchema = new Schema({
    code: String,
    user_id: String,
    course_id: String,
    course_amount: Number,
    assign_at: Date,
    course_tax_amount: Number,
    heman_amount: Number,
    sub_heman_amount: Number,
    user_discount: Number, 
    amount_credited: {
        type: Boolean,
        default: false
    }, 
    payment_under_process: {
        type: Boolean,
        default: false
    }, 
    transaction_id: String
},{ timestamps: true });  

module.exports =  mongoose.model('user_earning', UserEarningSchema);