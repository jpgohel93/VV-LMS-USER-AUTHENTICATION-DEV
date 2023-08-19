const { EmailLogsSchema } = require('../schema');

const createEmailLog = async (insertData) => {

    const createEmailLog = new EmailLogsSchema(insertData)

    const emailLogResult = await createEmailLog.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });
    return emailLogResult;
}


const findEmailLogById = async (message_id) => {

    const emailLogData =  await EmailLogsSchema.findOne({ message_id: message_id }).then((data) => {
        return data
    }).catch((err) => {
        console.log('err :: ',err);
        return false
    });

   return emailLogData;
}

const updateEmailLog = async (id,updateData) => {

    const updateLogResult =  await EmailLogsSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        console.log('err :: ',err);
        return false
    });

   return updateLogResult;
}

module.exports = {
    createEmailLog,
    findEmailLogById,
    updateEmailLog
}