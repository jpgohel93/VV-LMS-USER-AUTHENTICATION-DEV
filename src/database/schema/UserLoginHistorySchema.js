const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserLoginHistorySchema = new Schema({
    user_id: String,
    login_time: Date,
    device_type: String, // android, ios
    ip_address: String,
    device_uuid: {
        type: String,
        default: null
    },
    firebase_token: {
        type: String,
        default: null
    },
    operating_system: {
        type: String,
        default: null
    }, //ios or android 
},{ timestamps: true }); 

module.exports =  mongoose.model('user_login_history', UserLoginHistorySchema);