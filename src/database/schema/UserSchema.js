const mongoose = require('mongoose');

const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    institute_id: String,
    first_name: String,
    last_name: String,
    email: String,
    country_code: Number,
    mobile_no: String,
    birth_date: Date,
    gender: String,
    password: String,
    password_salt: String,
    otp: Number,
    opt_expired_at: Date,
    is_mobile_verified: Boolean,
    user_type: Number, //1 = admin , 2 = manager, 3 = User
    status: Number, //1 = active, 2 =  suspended, 3 = blocked
    google_login_id: String, 
    apple_login_id: String, 
    facebook_login_id: String,
    linkdin_login_id: String,
    note: String,
    user_signup_with: Number, //1 = Manual , 2 = Google, 3 = Facebook, 4 = linkdin, 5 = web, 6 = institute, 7 = apple , 8. Quick Sidnup
    profile_image: String,
    is_purchase_course: {
        type: Boolean,
        default: false
    },
    is_funnel_user: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_verify_otp: {
        type: Boolean,
        default: false
    },
    is_tc_verify: Boolean,
    last_login_type: Number, //1 = Manual , 2 = Google, 3 = Facebook, 4 = linkdin
    is_get_notification: {
        type: Boolean,
        default: true
    },
    app_language: {
        type: String,
        default: "english"
    },
    device_uuid: {
        type: String,
        default: null
    },
    notification_device_id: {
        type: String,
        default: null
    },
    firebase_token: {
        type: String,
        default: null
    },
    last_login_time: Date,
    country: {
        type: String,
        default: null
    },
    state:{
        type: String,
        default: null
    },
    city:{
        type: String,
        default: null
    },
    pincode:{
        type: String,
        default: null
    },
    latitude: {
        type: String,
        default: null
    },
    longitude: {
        type: String,
        default: null
    },
    operating_system: {
        type: String,
        default: null
    }, //ios or android
    referral_code: {
        type: String,
        default: null
    },
    is_heman: {
        type: Boolean,
        default: false
    } ,
    user_referral_code: String,
    users_referral_code: {
        type: String,
        default: null
    },
    referral_type: Number // 1. heman, 2. user
},{ timestamps: true }); 

UserSchema.index( { email : 1 } )
UserSchema.index( { mobile_no : 1 } )
UserSchema.index( { institute_id : 1 } )
 
module.exports =  mongoose.model('user', UserSchema);