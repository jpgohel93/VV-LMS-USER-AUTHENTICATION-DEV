const { PersonalizedQuizSchema } = require('../schema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const createQuiz = async (insertData) => {

    const quizresult = new PersonalizedQuizSchema(insertData)

    const quizresultResult = await quizresult.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return quizresultResult;
}

const updateQuiz = async (id,updateData) => {

    const quizresult = PersonalizedQuizSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return quizresult;
}

const fatchQuizList = async (user_id) => {

    const quizresultData = await PersonalizedQuizSchema.find({ 
        $and: [
            {
                user_id: user_id
            }
        ]
    },{_id: 1, title: 1, createdAt: 1}).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return quizresultData;
}

const filterQuizData = async (user_id, quiz_id) => {

    const quizresultData = await PersonalizedQuizSchema.aggregate([
        { $match:{
            user_id: user_id,
            _id: new ObjectId(quiz_id)
        }},
        {
            $project:{
                user_id: 1,
                title: 1,
                time_limit: 1,
                question_limit: 1,
                tags: 1,
                questions: "$questions.questions"
            }
        }
    ]).then((data) => {
        return data?.length > 0 ? data[0] : null
    }).catch((err) => {
        return null
    });
    
    return quizresultData;
}


const getQuizResult = async (user_id, quiz_id) => {
    const quizresultData = await PersonalizedQuizSchema.findOne({ 
        $and: [
            {
                user_id: user_id
            },
            {
                _id: quiz_id
            }
        ]
    }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return quizresultData;
}


module.exports = {
    createQuiz,
    updateQuiz,
    fatchQuizList,
    filterQuizData,
    getQuizResult
}