const { QuizResultModel } = require("../database");
const constants = require('../utils/constant');
const { CallCourseQueryEvent } = require('../utils/call-event-bus');

const addQuizResult = async (userInputs) => { 
    try{
        const { user_id, quiz_id, total_score, total_questions, time_left, total_attemped, total_unattemped, total_marked, total_skipped, total_wrong, total_correct,
            time_taken, accutacy, score_archive, answers, quiz_result, type, course_id, topic_id } = userInputs;

        const createQuizResult = await QuizResultModel.createQuizResult({ 
            user_id: user_id,
            quiz_id: quiz_id,
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
            quiz_result: quiz_result,
            type: type,
            course_id: course_id,
            topic_id: topic_id
        });

        if(createQuizResult !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Quiz result stored successfully",
                id: createQuizResult._id
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to stored a quiz result",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addQuizResult:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to stored a quiz result',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

const getQuizResultsData = async (userInputs, request) => {
    try {
        const { user_id, type  } = userInputs;

        const getQuizResultData = await QuizResultModel.fatchQuizResultList(user_id, type);
        
        if(getQuizResultData !== null){
            let promiseQuizResultData = null;
            let quizresultKey = 0
            if(getQuizResultData.length > 0){
                let quizresultData = [];
                promiseQuizResultData = await new Promise(async (resolve, reject) => {
                    getQuizResultData.map(async (quizresultElement) => {

                        if(quizresultElement?.type && quizresultElement?.type == 1){
                            let quiz = await CallCourseQueryEvent("get_quiz_by_id",{ quiz_id: quizresultElement.quiz_id  }, request.get("Authorization"))

                            await quizresultData.push({
                                _id: quizresultElement.id,
                                user_id: quizresultElement.user_id,
                                quiz_id: quizresultElement.quiz_id,
                                total_score: quizresultElement.total_score,
                                total_questions: quizresultElement.total_questions,
                                time_left: quizresultElement.time_left,
                                total_attemped: quizresultElement.total_attemped,
                                total_unattemped: quizresultElement.total_unattemped,
                                total_marked: quizresultElement.total_marked,
                                total_skipped: quizresultElement.total_skipped,
                                total_wrong: quizresultElement.total_wrong,
                                total_correct: quizresultElement.total_correct,
                                time_taken: quizresultElement.time_taken,
                                accutacy: quizresultElement.accutacy,
                                score_archive: quizresultElement.score_archive,
                                quiz_title: quiz?.title || '',
                                quiz_result: quizresultElement?.quiz_result || 0
                            })
                        }else if(quizresultElement?.type && quizresultElement?.type == 2){

                            let quiz = await CallCourseQueryEvent("get_topic_by_id",{ topic_id: quizresultElement.topic_id  }, request.get("Authorization"))

                            await quizresultData.push({
                                _id: quizresultElement.id,
                                user_id: quizresultElement.user_id,
                                topic_id: quizresultElement.topic_id,
                                course_id: quizresultElement.course_id,
                                total_score: quizresultElement.total_score,
                                total_questions: quizresultElement.total_questions,
                                time_left: quizresultElement.time_left,
                                total_attemped: quizresultElement.total_attemped,
                                total_unattemped: quizresultElement.total_unattemped,
                                total_marked: quizresultElement.total_marked,
                                total_skipped: quizresultElement.total_skipped,
                                total_wrong: quizresultElement.total_wrong,
                                total_correct: quizresultElement.total_correct,
                                time_taken: quizresultElement.time_taken,
                                accutacy: quizresultElement.accutacy,
                                score_archive: quizresultElement.score_archive,
                                quiz_title: quiz?.topics?.topic_name || '',
                                quiz_result: quizresultElement?.quiz_result || 0
                            })
                        }
                       
                        quizresultKey = quizresultKey + 1
                        if (getQuizResultData.length === quizresultKey) {
                            resolve(quizresultData)
                        }
                    });
                });
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: promiseQuizResultData
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getQuizResultsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get the result data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

const getQuizResults = async (userInputs, request) => {
    try{
        const { id  } = userInputs;

        const getQuizResultData = await QuizResultModel.filterQuizResultData(id);
        
        if(getQuizResultData !== null){

            if(getQuizResultData?.type && getQuizResultData?.type == 1){
                let quiz = await CallCourseQueryEvent("get_quiz_by_id",{ quiz_id: getQuizResultData.quiz_id  }, request.get("Authorization"))

                if(quiz){
                    await getQuizResultData.set('quiz_title ', quiz.title,{strict:false})
                }
            }else if(getQuizResultData?.type && getQuizResultData?.type == 2){
                let quiz = await CallCourseQueryEvent("get_topic_by_id",{ topic_id: getQuizResultData.topic_id  }, request.get("Authorization"))
                if(quiz){
                    await getQuizResultData.set('quiz_title ', quiz?.topics?.topic_name || '' ,{strict:false})
                }
            }
            
        
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getQuizResultData
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getQuizResults:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get the result data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const deleteQuizResult= async (userInputs) => {
    try{
        const { id } = userInputs;

        const deleteQuizResultItem = await QuizResultModel.removeQuizResultData(id);
        
        if(deleteQuizResultItem){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Quiz Result deleted successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to delete quiz result"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in deleteQuizResult:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to delete quiz result',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getReportQuizResult= async (userInputs, request) => {
    try {
        const { quiz_id, user_id, type  } = userInputs;

        const getQuizResultData = await QuizResultModel.countPassFailedResult(quiz_id, user_id, type);
        
        if(getQuizResultData !== null){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getQuizResultData
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getQuizResultsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get the result data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

module.exports = {
    addQuizResult,
    getQuizResultsData,
    deleteQuizResult,
    getQuizResults,
    getReportQuizResult
}