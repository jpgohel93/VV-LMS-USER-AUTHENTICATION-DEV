const mongoose = require('mongoose');

const Schema = mongoose.Schema;  

const InvoiceSchema = new Schema({
    user_id: String,
    reference_id: String,
    invoice_id: String,
    payment_id: String,
    order_id: String,
    course_id: String,
    course_type: String,
    subscription_id: String,
    purchase_time: Date ,
    innitial_response: String,
    payment_status: {
        default: 1,
        type: Number // 1. pending, 2. paid, 3. falied, 4. Authorized, 5. Refund Processed, 6. Refunded, 7. Refund create, 8. refund failed
    },
    payment_method: {
        default: " ",
        type: String // 1. Card, 2. Net Banking, 3. Wallet, 4. UPI
    },
    payment_response: String,
    payment_date: String,
    amount: Number,
    invoice_type: Number, // 1. subscribe course, 2. purchase course, 3. recurring payment
    module_name: String, // Checkout, Subscription/Payment, Webhook 
    title: String,
    is_send_mail: {
        default: false,
        type: Boolean
    }
},{ timestamps: true }); 

InvoiceSchema.index( { user_id : 1 } )
InvoiceSchema.index( { reference_id : 1 } )
InvoiceSchema.index( { invoice_id : 1 } )
 
module.exports =  mongoose.model('invoice', InvoiceSchema);
