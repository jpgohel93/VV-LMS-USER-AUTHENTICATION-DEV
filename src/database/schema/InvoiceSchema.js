const mongoose = require('mongoose');

const Schema = mongoose.Schema;  

const InvoiceSchema = new Schema({
    user_id: String,
    invoice_no: {
        default: "00001",
        type: String
    },
    invoice_year: {
        default: "2023-24",
        type: String
    },
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
    discount_amount: Number,
    discount: Number,
    is_tax_exclusive: Boolean,
    is_tax_inclusive: Boolean,
    tax_percentage: Number,
    tax_amount: Number,
    amount: Number,
    course_base_price: Number,
    convince_fee: Number,
    convince_fee_amount: Number,
    invoice_type: Number, // 1. subscribe course, 2. purchase course, 3. recurring payment
    module_name: String, // Checkout, Subscription/Payment, Webhook 
    title: String,
    is_send_mail: {
        default: false,
        type: Boolean
    },
    referral_code:  {
        default: null,
        type: String 
    },
    referral_amount:  {
        default: 0,
        type: Number 
    },
    basic_amount: {
        default: 0,
        type: Number 
    },
    coupon_code: String,
    coupon_amount: Number,
    heman_discount_amount: {
        default: 0,
        type: Number 
    },
},{ timestamps: true }); 

InvoiceSchema.index( { user_id : 1 } )
InvoiceSchema.index( { reference_id : 1 } )
InvoiceSchema.index( { invoice_id : 1 } )
 
module.exports =  mongoose.model('invoice', InvoiceSchema);
