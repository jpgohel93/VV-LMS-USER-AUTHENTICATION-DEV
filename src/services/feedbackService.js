const { FeedbackModel } = require("../database");
const constants = require('../utils/constant');
const { CallCourseQueryEvent } = require('../utils/call-event-bus');

const saveFeedback = async (userInputs, request) => {
    try{
        const { course_id, feedback_message } = userInputs;
        const user_id = request.user.user_id;
        const createFeedback = await FeedbackModel.storeFeedback({ 
            user_id,
            course_id,
            feedback_message
        });

        if(createFeedback !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Feedback has been added successfully.",
                id: createFeedback._id,
                data: createFeedback
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add feedback data.",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addNotes:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: "Failed to add feedback data.",
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const updateFeedback = async (userInputs, request) => {
    try{
        const { course_id, feedback_message, feedback_id } = userInputs;
        const user_id = request.user.user_id;
        const createFeedback = await FeedbackModel.updateFeedback({ 
            user_id,
            course_id,
            feedback_message
        }, feedback_id);

        if(createFeedback !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Feedback has been updated successfully.",
                id: createFeedback._id,
                data: createFeedback
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to update feedback data.",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addNotes:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: "Failed to add feedback data.",
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getFeedbackData = async (userInputs, request) => {

    try {
        const { course_id, startToken, endToken } = userInputs;
        const user_type = request.user.user_type;
        if(user_type == 3){
            const perPage = parseInt(endToken) || 10;
            let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
            if (page !== 0) {
                page = perPage * page;
            }
            const getFeedbackData = await FeedbackModel.fetchFeedbackData(page, perPage, course_id);
            
            if(getFeedbackData){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data get successfully",
                    data: getFeedbackData
                }
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Data not found",
                    data: null
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Not Authorized.",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getNotesData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch nodes',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const deleteFeedback = async (userInputs) => {
    try{
        const { id } = userInputs;

        const deleteFeedback = await FeedbackModel.removeFeedbackData(id);
        
        if(deleteFeedback){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Feedback has been deleted successfully."
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to delete data."
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in deleteFeedback:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to delete data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

module.exports = {
    saveFeedback,
    getFeedbackData,
    updateFeedback,
    deleteFeedback
}