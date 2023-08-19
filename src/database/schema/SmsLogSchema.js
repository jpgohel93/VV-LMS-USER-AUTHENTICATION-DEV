const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SmsLogSchema = new Schema({
    user_id: String,
    send_date: Date,
    message_id: String,
    message: String,
    from_number: String,
    status: Number, //1= 'pending',2= 'sent',3= 'failed',
    sms_response: String,
    sender_id: String,
    template_id: String,
    JobId: String,
    sms_type: Number  //1= otp
  },{ timestamps: true }); 


  SmsLogSchema.index( { user_id : 1 } )
  SmsLogSchema.index( { message_id : 1 } )

module.exports =  mongoose.model('sms_log', SmsLogSchema);