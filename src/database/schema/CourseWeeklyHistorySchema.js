const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseWeeklyHistorySchema = new Schema({
    user_id: String,
    course_id: String,
    last_accessed: Date,
    last_accessed_topic: String,
    week_no: Number,
    progress_topic: [String],
    completed_topic_at: [String],
},{ timestamps: true }); 

CourseWeeklyHistorySchema.index( { user_id : 1 } )
CourseWeeklyHistorySchema.index( { course_id : 1 } )

module.exports =  mongoose.model('course_weekly_history', CourseWeeklyHistorySchema);