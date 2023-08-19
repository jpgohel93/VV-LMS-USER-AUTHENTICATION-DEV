const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseWatchHistorySchema = new Schema({
    user_id: String,
    course_id: String,
    last_accessed: Date,
    last_accessed_chapter: String,
    last_accessed_topics: String,
    topics_completed_time: {
        type: String,
        default: "00:00:00" 
    },
    progress: [{
        topics_id: String,
        view_completed_time: String
    }],
    completed_chapter: [String],
    completed_topics: [String],
    is_course_completed : {
        type: Boolean,
        default: false
    },
    course_completion_date:{
        type: Date,
        default: null
    }
},{ timestamps: true }); 

CourseWatchHistorySchema.index( { user_id : 1 } )
CourseWatchHistorySchema.index( { course_id : 1 } )

module.exports =  mongoose.model('course_watch_history', CourseWatchHistorySchema);