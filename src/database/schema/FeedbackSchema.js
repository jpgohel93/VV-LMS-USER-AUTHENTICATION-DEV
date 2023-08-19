const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    course_id: String,
    feedback_message: String,
},{ timestamps: true }); 

feedbackSchema.index( { user_id : 1 } )
feedbackSchema.index( { course_id : 1 } )

module.exports =  mongoose.model('feedback', feedbackSchema);