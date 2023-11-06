const { UserActivityModel } = require("../database");
const constants = require('../utils/constant');
const moment = require('moment');

const addUserActivity= async (userInputs) => {
    try{
        
        const { user_id, module, reference_id } = userInputs;

        const createUserActivity= await UserActivityModel.createUserActivity({ 
            user_id: user_id,
            module: module,
            reference_id: reference_id,
            start_time: new Date()
        });

        if(createUserActivity!== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "activity add successfully",
                activity_id: createUserActivity._id
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the activity",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in activity:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the activity',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const updateUserActivity= async (userInputs) => {
    try{
        
        const { activity_id, end_time } = userInputs;

        const updateUserActivity= await UserActivityModel.updateUserActivity(activity_id, { 
            end_time: new Date()
        });

        if(updateUserActivity!== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "activity update successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to update the activity"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in activity:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the activity',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}


const dailyLearning= async (userInputs) => {
    try{
        
        const { course_id, user_id } = userInputs;

        let start_date = new Date(moment(new Date()).subtract(7, "days")).toISOString();
        const updateUserActivity= await UserActivityModel.dailyLearningInWeek(start_date, course_id, user_id);

        if(updateUserActivity!== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                data: updateUserActivity
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in activity:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the activity',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}


const timeSpendByModule= async (userInputs) => {
    try{
        
        const { user_id } = userInputs;
        const updateUserActivity= await UserActivityModel.timeSpendByModule(user_id);

        if(updateUserActivity!== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                data: updateUserActivity
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in activity:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the activity',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const subjectTimeSpend= async (userInputs) => {
    try{
        
        const { user_id, chapter_id } = userInputs;
        const updateUserActivity= await UserActivityModel.subjectTimeSpend(user_id, chapter_id);

        if(updateUserActivity!== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                data: updateUserActivity
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in activity:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the activity',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}


module.exports = {
    addUserActivity,
    updateUserActivity, 
    dailyLearning,
    timeSpendByModule,
    subjectTimeSpend
}