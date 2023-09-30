const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseViewSchema = new Schema({
    user_id: String,
    course_id: String,
    chapter_id: String,
    last_accessed: Date,
    last_access_topic: String,
    topics_completed_time: {
        type: String,
        default: "00:00:00" 
    },
    progress: [String]
},{ timestamps: true }); 

CourseViewSchema.index( { user_id : 1 } )
CourseViewSchema.index( { course_id : 1 } )

module.exports =  mongoose.model('course_view', CourseViewSchema);