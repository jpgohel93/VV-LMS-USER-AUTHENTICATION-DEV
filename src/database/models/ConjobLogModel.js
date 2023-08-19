const { ConjobLogSchema } = require('../schema');

const createConjobLog = async (insertData) => {

    const conjobLog = new ConjobLogSchema(insertData)

    const conjobLogResult = await conjobLog.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return conjobLogResult;
}

const updateConjobLog = async (id,updateData) => {

    const conjobLogResult =  await ConjobLogSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return conjobLogResult;
}
module.exports = {
    createConjobLog,
    updateConjobLog
}