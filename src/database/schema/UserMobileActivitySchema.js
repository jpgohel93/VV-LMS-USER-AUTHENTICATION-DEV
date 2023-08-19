const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserMobileActivitySchema = new Schema({
    user_id: String,
    start_time: Date,
    end_time: Date,
    device_type: String, // android, ios
    ip_address: String,
    device_uuid: {
        type: String,
        default: null
    },
    firebase_token: {
        type: String,
        default: null
    }
},{ timestamps: true }); 

module.exports =  mongoose.model('user_mobile_activity', UserMobileActivitySchema);