const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PaymentHistorySchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    transaction_id: String,
    course_id: String
},{ timestamps: true }); 

PaymentHistorySchema.index( { user_id : 1 } )



module.exports =  mongoose.model('payment_history', PaymentHistorySchema);