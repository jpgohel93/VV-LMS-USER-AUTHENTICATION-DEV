const { NotesModel } = require("../database");
const constants = require('../utils/constant');
const { CallCourseQueryEvent } = require('../utils/call-event-bus');

const addNotes = async (userInputs) => {
    try{
        const { user_id, course_id,chapter_id, topic_id, description, title, time } = userInputs;

        let noteType = topic_id ? 1 : 2
        const createNotes = await NotesModel.createNotes({ 
            user_id: user_id,
            course_id: course_id,
            chapter_id: chapter_id,
            topic_id: topic_id,
            description: description,
            title: title,
            time: time,
            note_type: noteType
        });

        if(createNotes !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Notes added into the course",
                id: createNotes._id,
                data: createNotes
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the notes into course",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addNotes:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the notes into course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const updateNotes = async (userInputs) => {
    try{
        const { id, description } = userInputs;

        const createFeedback = await NotesModel.updateNotes(id,{ 
            description
        });

        if(createFeedback !== false){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Note has been updated successfully.",
                data: {
                    id: id,
                    description: description
                }
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to update note description.",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in updateNotes:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: "Failed to update note data.",
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getNotesData = async (userInputs, request) => {

    try {
        const { user_id, course_id,chapter_id, topic_id, startToken, endToken, note_type  } = userInputs;

        const perPage = parseInt(endToken) || 10;
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) {
            page = perPage * page;
        }

        const getNotesData = await NotesModel.fatchNotesList({user_id, course_id,chapter_id, topic_id, page, perPage, note_type});
        
        if(getNotesData){
            let notesData = [];
            if(getNotesData.length > 0){
            
                let promiseNotesData = await new Promise(async (resolve, reject) => {
                    let keyCount = 0
                    await getNotesData.map(async (notesElement, notesKey) => {

                        await new Promise(async (resolve, reject) => {
                            let course = await CallCourseQueryEvent("get_topic_by_id",{ topic_id: notesElement.topic_id  }, request.get("Authorization"))
                           
                            if(course !== null){
                                notesData[notesKey] = {
                                    _id: notesElement.id,
                                    user_id: notesElement.user_id,
                                    course_id: notesElement.course_id,
                                    chapter_id: course?.chapter_id || "",
                                    topic_id: notesElement.topic_id,
                                    description: notesElement.description,
                                    title: notesElement.title,
                                    created_at: notesElement.createdAt,
                                    chapter_name: course?.chapter_name || "",
                                    topic_name: course?.topics?.topic_name || "",
                                    reference_link: course?.topics?.reference_link || "",
                                    content_video: course?.topics?.content_video || "",
                                    topic_type: course?.topics?.topic_type || "",
                                    content_type: course?.topics?.content_type || "",
                                    time: notesElement?.time|| "",
                                    note_type: notesElement?.note_type || 2
                                }
                                resolve(true)
                                
                                keyCount = keyCount + 1
                            }else{
                                await notesData.push({
                                    _id: notesElement.id,
                                    user_id: notesElement.user_id,
                                    course_id: notesElement.course_id,
                                    chapter_id: notesElement.chapter_id,
                                    topic_id: notesElement.topic_id,
                                    description: notesElement.description,
                                    title: notesElement.title,
                                    created_at: notesElement.createdAt,
                                    chapter_name: "",
                                    time: notesElement?.time|| ""
                                })

                                resolve(false)
                                
                                keyCount = keyCount + 1
                            }
                        })
                
                        if (getNotesData.length === keyCount ) {
                            resolve({
                                status: true,
                                status_code: constants.SUCCESS_RESPONSE,
                                message: "Data get successfully",
                                data: notesData
                            })
                        }
                    });
                });

                return promiseNotesData;
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data get successfully",
                    data: notesData
                }
            }
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

const deleteNotesItem = async (userInputs) => {
    try{
        const { id } = userInputs;

        const deleteNotesItem = await NotesModel.removeNotesData(id);
        
        if(deleteNotesItem){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Notes deleted successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to delete notes"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in deleteNotesItem:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to delete notes',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }   
}

module.exports = {
    addNotes,
    updateNotes,
    getNotesData,
    deleteNotesItem
}