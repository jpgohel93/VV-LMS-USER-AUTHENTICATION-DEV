const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuizResultSchema = new Schema({
    quiz_id: String,
    user_id: String,
    course_id: String,
    topic_id: String,
    type: Number, // 1. Quiz, 2. Course quiz
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
    ]
  },{ timestamps: true }); 

  QuizResultSchema.index( { user_id : 1 } )
  QuizResultSchema.index( { quiz_id : 1 } )
  QuizResultSchema.index( { topic_id : 1 } )

module.exports =  mongoose.model('quiz_result', QuizResultSchema);