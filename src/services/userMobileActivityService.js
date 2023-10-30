const { UserMobileActivityModel, UserModel } = require("../database");
const constants = require('../utils/constant');
const { GetUserLocation } = require('../utils');

const addUserMobileActivity = async (userInputs) => {
    try{
        const { user_id,device_type,ip_address, device_uuid, firebase_token } = userInputs;

        const createUserMobileActivity = await UserMobileActivityModel.createUserMobileActivity({ 
            user_id: user_id,
            device_type: device_type,
            ip_address: ip_address,
            start_time: new Date(),
            device_uuid: device_uuid,
            firebase_token: firebase_token 
        });

        let studentData = { 
            device_uuid: device_uuid,
            firebase_token: firebase_token,
            last_login_time: new Date()
        }
        if(ip_address){
            let locationData = await GetUserLocation(ip_address);

            studentData['country'] = locationData?.country_name || null
            studentData['state'] = locationData?.region_name || null
            studentData['city'] = locationData?.city || null
            studentData['pincode'] = locationData?.zip_code || null
            studentData['latitude'] = locationData?.latitude || null
            studentData['longitude'] = locationData?.longitude || null
        }

        //update last login time
        UserModel.updateUser(user_id,studentData);

        if(createUserMobileActivity !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Activity added successfully",
                id: createUserMobileActivity._id
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
        console.error('Error in addUserMobileActivity:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the activity',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const updateUserMobileActivity = async (userInputs) => {
    try{
        const { id } = userInputs;

        const updateUserMobileActivity = await UserMobileActivityModel.updateUserMobileActivity(id,{ 
            end_time: new Date()
        });
        

        if(updateUserMobileActivity !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Activity added successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the activity"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addUserMobileActivity:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the activity',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getUserMobileActivitysData = async (userInputs, request) => {
    try{
        const { user_id  } = userInputs;

        const getUserMobileActivitysData = await UserMobileActivityModel.fatchUserMobileActivityList(user_id);
        
        if(getUserMobileActivitysData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getUserMobileActivitysData
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
        console.error('Error in getUserMobileActivitysData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const addUserLoginHistory = async (userInputs) => {
    try{
        const { user_id,device_type,ip_address } = userInputs;

        const createUserMobileActivity = await UserMobileActivityModel.createUserLoginHistory({ 
            user_id: user_id,
            device_type: device_type,
            ip_address: ip_address,
            login_time: new Date()
        });

        if(createUserMobileActivity !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Activity added successfully",
                id: createUserMobileActivity._id
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
        console.error('Error in addUserLoginHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the activity',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getUserLoginHistoryData = async (userInputs, request) => {
    try{
        const { user_id  } = userInputs;

        const getUserMobileActivitysData = await UserMobileActivityModel.fatchUserLoginHistoryList(user_id);
        
        if(getUserMobileActivitysData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getUserMobileActivitysData
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
        console.error('Error in getUserLoginHistoryData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

module.exports = {
    addUserMobileActivity,
    getUserMobileActivitysData,
    updateUserMobileActivity,
    addUserLoginHistory,
    getUserLoginHistoryData
}