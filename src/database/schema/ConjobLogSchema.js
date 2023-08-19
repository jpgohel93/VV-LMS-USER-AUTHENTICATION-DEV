const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CronjobLogSchema = new Schema({
    type: String,
    request: String,
    header: String,
    response: String,
    url: String ,
    details: String,
    start_time: Date,
    end_time: Date,
    executation_time: Number
},{ timestamps: true }); 

module.exports =  mongoose.model('cronjob_log', CronjobLogSchema);