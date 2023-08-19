const { PaymentWebhookSchema } = require('../schema');

const saveWebhookResponse = async (insertData) => {
    const saveWebhook = new PaymentWebhookSchema(insertData)

    const csaveWebhookResult = await saveWebhook.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return csaveWebhookResult;
}


module.exports = {
    saveWebhookResponse
}