const { NotesSchema } = require('../schema');

const createNotes = async (insertData) => {

    const notes = new NotesSchema(insertData)

    const notesResult = await notes.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return notesResult;
}

const updateNotes = async (id,updateData) => {

    const notesResult =  await NotesSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return notesResult;
}

const fatchNotesList = async (userInput) => {

    let filter = [];
    if(userInput.user_id){
        filter.push({
            user_id: userInput.user_id
        })
    }

    if(userInput.course_id){
        filter.push({
            course_id: userInput.course_id
        })
    }

    if(userInput.chapter_id){
        filter.push({
            chapter_id: userInput.chapter_id
        })
    }

    if(userInput.topic_id){
        filter.push({
            topic_id: userInput.topic_id
        })
    }

    if(userInput.note_type){
        filter.push({
            note_type: userInput.note_type
        })
    }

    const notesData = await NotesSchema.find({ 
        $and: filter
    }).skip(userInput.page).limit(userInput.perPage).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return notesData;
}

const filterNotesData = async (user_id, course_id,chapter_id, topic_id) => {

    const notesData = await NotesSchema.findOne({ 
        $and: [
            {
                user_id: user_id
            },
            {
                course_id: course_id
            },
            {
                chapter_id: chapter_id
            },
            {
                topic_id: topic_id
            }
        ]
    }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return notesData;
}

const removeNotesData = async (id) => {

    const notesData = await NotesSchema.deleteOne({_id: id }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return notesData;
}



module.exports = {
    createNotes,
    updateNotes,
    removeNotesData,
    fatchNotesList,
    filterNotesData
}