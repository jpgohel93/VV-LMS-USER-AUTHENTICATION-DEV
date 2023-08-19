const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    type: String,
    reference_id: String,
    response: String
},{ timestamps: true }); 

module.exports =  mongoose.model('payment_webhook', customerSchema);