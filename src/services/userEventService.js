const { CallEventBus, CallUserEvent } = require('../utils/call-event-bus');
const constants = require('../utils/constant');

const getUserEventList = async (userInput, request) => {
    try{
        const { startToken, endToken, user_event_type, user_id } = userInput;
        let eventData = await CallEventBus("get_user_event_list", { startToken:startToken, endToken:endToken, user_event_type:user_event_type }, request.get("Authorization"));
        if(eventData?.data?.length ?? 0 > 0){
        
                await Promise.all(
                    await eventData.data.map(async (eventelement, eventkey) => {
                        let userEventData = await CallEventBus("user_event_status", { event_id: eventelement._id , user_id }, request.get("Authorization"));

                        eventData.data[eventkey]['is_registration'] = userEventData?.is_registration
                        eventData.data[eventkey]['registration_date'] = userEventData?.data?.registration_date || null
                        
                        eventData.data[eventkey]['is_limit'] = eventelement?.is_limit && eventelement?.is_limit == true ? false : true

                        const eventUserList = await CallEventBus("get_event_registration_list", { event_id: eventelement._id , startToken:1, endToken: 5 }, request.get("Authorization"));

                        if(eventUserList?.data?.length > 0){
                            let studentProfileData = []
                            let countIndex = 0
                            await new Promise(async (resolve, reject) => {
                                await eventUserList.data.map(async(element,key) => {
                                   let studentData = await CallUserEvent("get_student_by_id",{ id: element.user_id }, request.get("Authorization"))
                
                                    if(studentData !== null && studentData !== undefined){
                
                                        let profileImage = studentData.profile_image !== undefined ? studentData.profile_image : '';
                
                                        studentProfileData.push({
                                            profile_image: profileImage,
                                            user_name:  studentData.first_name + " " + studentData.last_name
                                        })
                                    }else{
                                        studentProfileData.push({
                                            profile_image: '',
                                            user_name: ''
                                        })
                                    }
                                    countIndex = countIndex + 1
                
                                    if(eventUserList.data.length === countIndex){
                                        resolve(true)
                                    }
                                });
                            })
                
                            eventData.data[eventkey]['user_profile'] = studentProfileData|| null
                        }else{
                            eventData.data[eventkey]['user_profile'] = []
                        }
                    })
                )
        }
    
        return eventData;
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getUserEventList:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch event data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const joinUserToEvent = async (userInput, request) => {
    try{
        const { event_id, user_id } = userInput;
        return await CallEventBus("join_user_event", { event_id: event_id, user_id: user_id }, request.get("Authorization"));
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in joinUserToEvent:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to join the event',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

module.exports = {
    getUserEventList,
    joinUserToEvent
}