const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentLogsSchema = new Schema({
    user_id: String,
    invoice_id: String,
    subscription_id: String,
    user_course_data: String,
    order_id: String,
    log_type: String,
    event: String,
    response:String,
    start_time: Date,
    end_time: Date
},{ timestamps: true }); 

PaymentLogsSchema.index( { user_id : 1 } )
PaymentLogsSchema.index( { invoice_id : 1 } )
PaymentLogsSchema.index( { subscription_id : 1 } )


module.exports =  mongoose.model('payment_logs', PaymentLogsSchema);