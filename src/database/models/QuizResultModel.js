const { QuizResultSchema } = require('../schema');

const createQuizResult = async (insertData) => {

    const quizresult = new QuizResultSchema(insertData)

    const quizresultResult = await quizresult.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return quizresultResult;
}

const fatchQuizResultList = async (user_id, type) => {
    let whereCondition = []

    if(type){
        whereCondition.push({
            type: type
        })
    }
    whereCondition.push({
        user_id: user_id
    })
    const quizresultData = await QuizResultSchema.find({ 
        $and: whereCondition
    }).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return quizresultData;
}

const filterQuizResultData = async (id) => {

    const quizresultData = await QuizResultSchema.findOne({ 
        $and: [
            {
                _id: id
            }
        ]
    }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return quizresultData;
}

const removeQuizResultData = async (id) => {

    const quizresultData = await QuizResultSchema.deleteOne({_id: id }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return quizresultData;
}

const countPassFailedResult = async (quiz_id, user_id, type) => {
    const quizresultData = await QuizResultSchema.aggregate([
        {
            $match: { type: type, user_id: user_id, quiz_id: { $in : quiz_id}}
        },
        {
          $group: {
            _id: "$quiz_result",
            count: { $sum: 1 }
          }
        }
      ]).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return quizresultData;
}

module.exports = {
    createQuizResult,
    removeQuizResultData,
    fatchQuizResultList,
    filterQuizResultData,
    countPassFailedResult
}