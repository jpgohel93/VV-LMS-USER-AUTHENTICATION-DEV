const { SmsLogSchema } = require('../schema');

const createSmsLog = async (insertData) => {

    const smslog = new SmsLogSchema(insertData)

    const smslogResult = await smslog.save().then((data) => {
        return data;
    }).catch((err) => {
        return null;
    });

    return smslogResult;

}
module.exports = {
    createSmsLog
}