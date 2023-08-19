const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CoursePlanSchema = new Schema({
    cron_id: String,
    type: String,
    request: String,
    header: String,
    response: String,
    url: String ,
    details: String,
    execution_time: Date
},{ timestamps: true }); 

module.exports =  mongoose.model('api_call', CoursePlanSchema);