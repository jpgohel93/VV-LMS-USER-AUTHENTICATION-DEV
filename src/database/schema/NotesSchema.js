const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserNotesSchema = new Schema({
    user_id: String,
    course_id: String,
    chapter_id: String,
    topic_id: String,
    title: String,
    description: String,
    time: String,
    note_type: {
        type: Number,
        default: 1 // 1. topic , 2. general
    }
},{ timestamps: true }); 

UserNotesSchema.index( { user_id : 1 } )
UserNotesSchema.index( { topic_id : 1 } )

module.exports =  mongoose.model('user_notes', UserNotesSchema);