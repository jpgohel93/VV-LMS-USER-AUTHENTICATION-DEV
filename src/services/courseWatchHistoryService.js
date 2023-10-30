const { CourseWatchHistoryModel, UserActivityModel } = require("../database");
const constants = require('../utils/constant');
const { CallCourseQueryEvent, CallCourseQueryDataEvent } = require('../utils/call-event-bus');

const addCourseWatchHistory = async (userInputs) => {
    try{

        const { user_id, course_id } = userInputs;
        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, course_id);

        //create activity
        let userActivity = await UserActivityModel.createUserActivity({
            module: "course",
            user_id: user_id,
            reference_id: course_id,
            start_time: new Date()
        })


        if(checkCourseWatchHistoryData == null){
            const createCourseWatchHistory = await CourseWatchHistoryModel.createCourseWatchHistory({ 
                user_id: user_id,
                course_id: course_id,
                last_accessed: new Date()
            });

            if(createCourseWatchHistory !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully",
                    id: createCourseWatchHistory._id,
                    activity_id: userActivity._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to add the course history",
                    id: null
                };
            }
        }else{
            const updateCourseWatchHistoryData = await CourseWatchHistoryModel.updateCourseWatchHistoryData(checkCourseWatchHistoryData._id,{ 
                last_accessed: new Date()
            });

            if(updateCourseWatchHistoryData !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully",
                    id: checkCourseWatchHistoryData._id,
                    activity_id: userActivity._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to add the course history",
                    id: null
                };
            }
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addCourseWatchHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const addCourseChapterWatchHistory = async (userInputs) => {

    try{
        const { user_id, course_id, chapter_id, topic_id } = userInputs;
        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, course_id);

        let userActivity = await UserActivityModel.createUserActivity({
            module: "chapter",
            user_id: user_id,
            reference_id: chapter_id,
            start_time: new Date()
        })

        if(checkCourseWatchHistoryData){
            const updateCourseWatchHistoryData = await CourseWatchHistoryModel.updateCourseWatchHistoryData(checkCourseWatchHistoryData._id,{ 
                last_accessed_chapter: chapter_id,
                last_accessed_topics: topic_id
            });
        

            if(updateCourseWatchHistoryData !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully",
                    id: checkCourseWatchHistoryData._id,
                    activity_id: userActivity._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to add the course history",
                    id: null
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the course history",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addCourseChapterWatchHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const addCourseTopicWatchHistory = async (userInputs) => {
    try{
        const { user_id, course_id, topic_id,view_completed_time } = userInputs;
        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, course_id);


        if(checkCourseWatchHistoryData){

            //delete the course topic watch history
            await CourseWatchHistoryModel.deleteCompletedTopic(user_id, course_id,topic_id);

            await CourseWatchHistoryModel.updateCourseWatchHistoryData(checkCourseWatchHistoryData._id,{ 
                topics_completed_time: view_completed_time
            });

            const updateCourseWatchHistoryData = await CourseWatchHistoryModel.addCourseTopicWatchHistory(checkCourseWatchHistoryData._id,{ 
                topics_id: topic_id,
                view_completed_time: view_completed_time,
                view_at: new Date()
            });

            if(updateCourseWatchHistoryData !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully",
                    id: checkCourseWatchHistoryData._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to add the course history",
                    id: null
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the course history",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addCourseTopicWatchHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const addCompletedChapter = async (userInputs) => {

    try{
        const { user_id, course_id, chapter_id } = userInputs;
        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, course_id);


        if(checkCourseWatchHistoryData){
            const checkCompletedChapter = await CourseWatchHistoryModel.checkCompletedChapter(checkCourseWatchHistoryData._id, chapter_id);
            if(checkCompletedChapter == null){
                const updateCourseWatchHistoryData = await CourseWatchHistoryModel.addCompletedChapter(checkCourseWatchHistoryData._id, chapter_id);

                if(updateCourseWatchHistoryData !== false){
                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: "Course history add successfully",
                        id: checkCourseWatchHistoryData._id
                    };
                }else{
                    return {
                        status: false,
                        status_code: constants.DATABASE_ERROR_RESPONSE,
                        message: "Failed to add the course history",
                        id: null
                    };
                }
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully",
                    id: checkCourseWatchHistoryData._id
                };
            }
            
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the course history",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addCompletedChapter:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const addCompletedTopic = async (userInputs) => {
    try{
        const { user_id, course_id, topic_id } = userInputs;

        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, course_id);

        if(checkCourseWatchHistoryData){
            const checkCompletedTopics = await CourseWatchHistoryModel.checkCompletedTopics(checkCourseWatchHistoryData._id, topic_id);
            if(checkCompletedTopics == null){
                //delete the course topic watch history
                await CourseWatchHistoryModel.deleteCompletedTopic(user_id, course_id,topic_id);

                const updateCourseWatchHistoryData = await CourseWatchHistoryModel.addCompletedTopic(checkCourseWatchHistoryData._id,topic_id);

                CourseWatchHistoryModel.addCompletedTopic(checkCourseWatchHistoryData._id,{
                    topics_id: topic_id,
                    view_at: new  Date()
                });

                if(updateCourseWatchHistoryData !== false){
                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: "Course history add successfully",
                        id: checkCourseWatchHistoryData._id
                    };
                }else{
                    return {
                        status: false,
                        status_code: constants.DATABASE_ERROR_RESPONSE,
                        message: "Failed to add the course history",
                        id: null
                    };
                }
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully",
                    id: checkCourseWatchHistoryData._id
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the course history",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addCompletedTopic:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getCourseWatchHistorysData = async (userInputs, request) => {
    try{
        const { user_id  } = userInputs;

        const getCourseWatchHistoryData = await CourseWatchHistoryModel.fatchCourseWatchHistoryList(user_id);
        
        if(getCourseWatchHistoryData){
            let promiseCourseWatchHistoryData = null;
            if(getCourseWatchHistoryData.length > 0){
                let coursewatchhistoryData = [];
                promiseCourseWatchHistoryData = await new Promise(async (resolve, reject) => {
                    getCourseWatchHistoryData.map(async (coursewatchhistoryElement, coursewatchhistoryKey) => {

                        let course = await CallCourseQueryEvent("get_course_data_without_auth",{ id: coursewatchhistoryElement.course_id  }, request.get("Authorization"));
                        let courseChapterCount = await CallCourseQueryDataEvent("get_chapter_count",{ course_id: coursewatchhistoryElement.course_id  }, request.get("Authorization"));
                        
                        let perForCompletedChapter = 0;
                        if(courseChapterCount.total_chapter > 0 && coursewatchhistoryElement.completed_chapter.length > 0){
                            perForCompletedChapter = coursewatchhistoryElement.completed_chapter.length * 100 / parseInt(courseChapterCount.total_chapter);
                        }
                    
                        await coursewatchhistoryData.push({
                            _id: coursewatchhistoryElement.id,
                            total_chapter: courseChapterCount.total_chapter,
                            total_watched_chapter: coursewatchhistoryElement.completed_chapter.length,
                            per_completed_chapter: parseInt(perForCompletedChapter),
                            course: course
                        })

                        if (getCourseWatchHistoryData.length === (coursewatchhistoryKey + 1)) {
                            resolve(coursewatchhistoryData)
                        }
                    });
                });
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: promiseCourseWatchHistoryData
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
        console.error('Error in getCourseWatchHistorysData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const deleteCourseWatchHistoryItem = async (userInputs) => {
    try{
        const { user_id, course_id } = userInputs;

        const deleteCourseWatchHistoryItem = await CourseWatchHistoryModel.removeCourseWatchHistoryData(user_id, course_id);
        
        if(deleteCourseWatchHistoryItem){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Course Watch History deleted successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to delete course watch history"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in deleteCourseWatchHistoryItem:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to delete course watch history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}


const getSingleCourseWatchHistory = async (userInputs) => {
    try{
        const { user_id, course_id  } = userInputs;

        const getCourseWatchHistoryData = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, course_id);
        
        if(getCourseWatchHistoryData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getCourseWatchHistoryData
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
        console.error('Error in getSingleCourseWatchHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fatch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getCourseWatchHistoryWithPagination = async (userInputs) => {
    try{
        const { user_id, course_id, startToken, endToken  } = userInputs;
        
        const perPage = parseInt(endToken) || 3;
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) {
            page = perPage * page;
        }

        const getCourseWatchHistoryData = await CourseWatchHistoryModel.fetchCourseWatchHistory(user_id, course_id, page, perPage);
        
        if(getCourseWatchHistoryData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getCourseWatchHistoryData
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
        console.error('Error in getSingleCourseWatchHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fatch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const makeCourseAsACompleted = async (userInputs) => {
    try{

        const { user_id, course_id} = userInputs;

        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, course_id);

        if(checkCourseWatchHistoryData){
            const courseMakeAsACompleted = await CourseWatchHistoryModel.updateCourseWatchHistoryData(checkCourseWatchHistoryData._id,{ 
                is_course_completed: true,
                course_completion_date: new Date()
            });
        

            if(courseMakeAsACompleted !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course status change successfully",
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to change the course status"
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to change the course status"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in makeCourseAsACompleted:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to change the course status',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const addChapterViewHistory = async (userInputs) => {
    try{

        const { user_id, course_id, chapter_id } = userInputs;
        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.fatchCourseViewHistoryList(user_id, course_id, chapter_id);

        //create activity
        let userActivity = await UserActivityModel.createUserActivity({
            module: "course",
            user_id: user_id,
            reference_id: course_id,
            start_time: new Date()
        })


        if(checkCourseWatchHistoryData == null){
            const createCourseWatchHistory = await CourseWatchHistoryModel.createCourseViewHistory({ 
                user_id: user_id,
                course_id: course_id,
                chapter_id: chapter_id,
                last_accessed: new Date()
            });

            if(createCourseWatchHistory !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully",
                    id: createCourseWatchHistory._id,
                    activity_id: userActivity._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to add the course history",
                    id: null
                };
            }
        }else{
            const updateCourseWatchHistoryData = await CourseWatchHistoryModel.updateCourseViewHistory(checkCourseWatchHistoryData._id,{ 
                last_accessed: new Date()
            });

            if(updateCourseWatchHistoryData !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully",
                    id: checkCourseWatchHistoryData._id,
                    activity_id: userActivity._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to add the course history",
                    id: null
                };
            }
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addCourseWatchHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const addTopicViewHistory = async (userInputs) => {
    try{

        const { user_id, course_id, chapter_id, topic_id } = userInputs;
        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.fatchCourseViewHistoryList(user_id, course_id, chapter_id);

        //delete the course topic watch history
        await CourseWatchHistoryModel.deleteCompletedTopics(checkCourseWatchHistoryData._id,topic_id);

        const createCourseWatchHistory = await CourseWatchHistoryModel.addCourseTopicViewHistory(checkCourseWatchHistoryData._id, topic_id); 

        if(createCourseWatchHistory !== false){
            await CourseWatchHistoryModel.updateCourseViewHistory(checkCourseWatchHistoryData._id, {
                last_access_topic: topic_id
            });
            
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Course history add successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the course history",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addCourseWatchHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getTopicViewHistory = async (userInputs) => {
    try{

        const { user_id, course_id, chapter_id } = userInputs;

        let CourseWatchHistoryData = await CourseWatchHistoryModel.fatchCourseViewHistoryList(user_id, course_id, chapter_id);

        if(CourseWatchHistoryData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: CourseWatchHistoryData
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
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const topicCompleted = async (userInputs) => {
    try{
        const { user_id, course_id, chapter_id, topic_id } = userInputs;
        let checkCourseWatchHistoryData = await CourseWatchHistoryModel.fatchCourseViewHistoryList(user_id, course_id, chapter_id);

        if(checkCourseWatchHistoryData){
            //delete the course topic watch history
            await CourseWatchHistoryModel.deleteCompletedTopicData(checkCourseWatchHistoryData._id,topic_id);

            //delete the course topic watch history
            await CourseWatchHistoryModel.deleteCompletedTopics(checkCourseWatchHistoryData._id,topic_id);

            const createCourseWatchHistory = await CourseWatchHistoryModel.addCourseTopicCompleted(checkCourseWatchHistoryData._id, topic_id); 

            if(createCourseWatchHistory !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course history add successfully"
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to add the course history",
                    id: null
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the course history",
                id: null
            };
        }
        
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addCourseWatchHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getTopicViewHistoryList = async (userInputs) => {
    try{

        const { user_id, course_id } = userInputs;

        let CourseWatchHistoryData = await CourseWatchHistoryModel.fatchCourseViewHistory(user_id, course_id);

        if(CourseWatchHistoryData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: CourseWatchHistoryData
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
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course history',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

module.exports = {
    addCourseWatchHistory,
    getCourseWatchHistorysData,
    deleteCourseWatchHistoryItem,
    addCourseTopicWatchHistory,
    addCourseChapterWatchHistory,
    addCompletedChapter,
    addCompletedTopic,
    getSingleCourseWatchHistory,
    makeCourseAsACompleted,
    getCourseWatchHistoryWithPagination,
    addChapterViewHistory,
    addTopicViewHistory,
    getTopicViewHistory,
    topicCompleted,
    getTopicViewHistoryList
}