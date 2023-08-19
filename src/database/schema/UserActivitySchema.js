const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseWatchHistorySchema = new Schema({
    module: String, //course,reels,pyq,quiz
    user_id: String,
    reference_id: String,
    start_time: Date,
    end_time: Date
},{ timestamps: true }); 

CourseWatchHistorySchema.index( { user_id : 1 } )
CourseWatchHistorySchema.index( { reference_id : 1 } )

module.exports =  mongoose.model('user_activity', CourseWatchHistorySchema);