const { PersonalizedQuizModel } = require("../database");
const constants = require('../utils/constant');

const addQuiz = async (userInputs) => {
    try{
        const { user_id, quiz_title, time_limit, question_limit, questions, tags, is_time_limit} = userInputs;

        const createQuizResult = await PersonalizedQuizModel.createQuiz({ 
            user_id: user_id,
            title: quiz_title,
            time_limit: time_limit,
            question_limit: question_limit,
            questions: questions,
            tags: tags,
            is_time_limit: is_time_limit
        });
    
        if(createQuizResult !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Quiz stored successfully",
                id: createQuizResult._id
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to stored a quiz",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addQuiz:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to stored a quiz',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
    
}

const updateQuiz = async (userInputs) => {
    try{
        const { quiz_id, total_score, total_questions, time_left, total_attemped, total_unattemped, total_marked, total_skipped, total_wrong, total_correct,
            time_taken, accutacy, score_archive, answers, quiz_result} = userInputs;

        const createQuizResult = await PersonalizedQuizModel.updateQuiz(quiz_id,{ 
            total_score: total_score,
            total_questions: total_questions,
            time_left: time_left,
            total_attemped: total_attemped,
            total_unattemped: total_unattemped,
            total_marked: total_marked,
            total_skipped: total_skipped,
            total_wrong: total_wrong,
            total_correct: total_correct,
            time_taken: time_taken,
            accutacy: accutacy,
            score_archive: score_archive,
            answers: answers,
            quiz_result: quiz_result
        });

        if(createQuizResult !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Quiz updated successfully",
                id: quiz_id
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to update quiz",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in updateQuiz:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to update quiz',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

const getQuizData = async (userInputs) => {
    try{
        const { user_id  } = userInputs;

        const getQuizResultData = await PersonalizedQuizModel.fatchQuizList(user_id);
        
        if(getQuizResultData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getQuizResultData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getQuizData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get quiz data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

const getQuiz = async (userInputs) => {
    try{
        const { user_id, quiz_id  } = userInputs;

        const getQuizResultData = await PersonalizedQuizModel.filterQuizData(user_id, quiz_id);
        
        if(getQuizResultData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getQuizResultData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getQuiz:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get quiz data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

const getQuizResult = async (userInputs) => {
    try{
        const { user_id, quiz_id  } = userInputs;

        const getQuizResultData = await PersonalizedQuizModel.getQuizResult(user_id, quiz_id);
        
        if(getQuizResultData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getQuizResultData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getQuiz:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get quiz data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

module.exports = {
    addQuiz,
    updateQuiz,
    getQuizData,
    getQuiz,
    getQuizResult
}