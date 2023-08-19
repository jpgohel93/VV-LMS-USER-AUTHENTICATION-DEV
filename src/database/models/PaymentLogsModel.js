const { PaymentLogsSchema } = require('../schema');

const createPaymentLogs = async (insertData) => {

    const PaymentLogs = new PaymentLogsSchema(insertData)

    const paymentLog = await PaymentLogs.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return paymentLog;
}


const updatePaymentLogs = async (id,updateData) => {

    const paymentLog = PaymentLogsSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return paymentLog;
}



module.exports = {
    createPaymentLogs,
    updatePaymentLogs
}