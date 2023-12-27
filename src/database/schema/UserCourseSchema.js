const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserCourseSchema = new Schema({
    user_id: String,
    course_id: String,
    duration: String, // day, month, year , quarter, two-year
    duration_time: Number,
    is_lifetime_access: {
        default: false,
        type: Boolean
    },
    type: Number, //1. assigned , 2. Purchased
    is_deleted:{
        default: false,
        type: Boolean
    },
    course_subscription_type: Number,// 1 = free_trial_duration , 2 = free_trial_resource_unlocked, 3= one_time_charge, 4= recurring_price
    purchase_date: Date,
    price: Number,
    amount: Number,
    discount_amount: Number,
    discount: Number,
    is_tax_inclusive: Boolean,
    is_tax_exclusive: Boolean,
    tax_percentage: Number,
    payment_method: String, // razorpay
    plan_id: String,
    subscription_id: String,
    expire_date: Date,
    is_cancle_subscription: {
        default: false,
        type: Boolean
    },
    payment_status: {
        default: 1,
        type: Number // 1. pending, 2. paid, 3. falied
    },
    subscription_cancle_date: Date,
    is_expired: {
        default: false,
        type: Boolean
    },
    expire_by_cron_at: Date,
    invoice_id: {
        default: null,
        type: String
    },
    subscription_start_date: Date,
    subscription_date: Date,
    subscription_recurring_date: Date,
    subscription_link: String,
    linkexpired_at: Date,
    is_purchase:{
        default: false,
        type: Boolean
    },
    is_send_mail: {
        default: false,
        type: Boolean
    },
    tax_amount: Number,
    heman_discount_amount: Number,
    convince_fee: Number,
    convince_fee_amount: Number,
    order_id: String,
    coupon_code: String,
    coupon_amount: String,
    last_access_week: {
        default: 0,
        type: Number
    },
},{ timestamps: true });

UserCourseSchema.index( { user_id : 1 } )
UserCourseSchema.index( { course_id : 1 } )
 
module.exports =  mongoose.model('user_course', UserCourseSchema);