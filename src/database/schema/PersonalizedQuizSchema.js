const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PersonalizedQuizSchema = new Schema({
    user_id: String,
    title: String,
    is_time_limit: Boolean,
    time_limit: String,
    question_limit: Number,
    questions: [Object],
    answers: [
        {
          question_id: String,
          question: String,
          chosen_option: [String],
          is_correct: Boolean,
          correct_option: [String],
          is_marked: Boolean,
          is_unseen: Boolean,
          is_unattemped: Boolean,
          is_attemped: Boolean
        }
    ],
    total_score: Number,    
    total_questions: Number,
    time_left: String,
    total_attemped: Number,
    total_unattemped: Number,
    total_marked: Number,
    total_skipped: Number,
    total_wrong: Number,
    total_correct: Number,
    time_taken: String,
    accutacy: Number,
    score_archive: Number,
    quiz_result: Number, // 1 = pass, 2 = fail
    tags: [String]
},{ timestamps: true }); 

PersonalizedQuizSchema.index( { user_id : 1 } )

module.exports =  mongoose.model('personalized_quiz', PersonalizedQuizSchema);