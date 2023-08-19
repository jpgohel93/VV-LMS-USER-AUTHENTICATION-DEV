const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EmailLogsSchema = new Schema({
    user_id: String,
    message_id: String,
    from: String,
    to: String,
    subject: String,
    message: String,
    status: {
        default: "Sending",
        type: String
    },
    module: String,
    reference_id: String,
    route: {
        default: "Outbox",
        type: String
    },
    response: String
},{ timestamps: true });

EmailLogsSchema.index( { user_id : 1 } )
EmailLogsSchema.index( { message_id : 1 } )

module.exports =  mongoose.model('email_logs', EmailLogsSchema);