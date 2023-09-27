const { PaymentDetailSchema } = require('../schema');

const createPaymentDetail = async (insertData) => {

    const paymentDetail = new PaymentDetailSchema(insertData)

    const paymentDetailResult = await paymentDetail.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });;
    return paymentDetailResult;
}

const updatePaymentDetail = async (id,updateData) => {

    const paymentDetailResult = PaymentDetailSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return paymentDetailResult;
}

const fatchPaymentDetails = async (user_id) => {
    const paymentDetailData = await PaymentDetailSchema.find({ user_id: user_id, is_deleted: false }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return paymentDetailData;
}


const fatchPaymentDetailById = async (id) => {
    const paymentDetailData = await PaymentDetailSchema.findOne({ _id: id, is_deleted: false }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return paymentDetailData;
}

module.exports = {
    createPaymentDetail,
    updatePaymentDetail,
    fatchPaymentDetailById,
    fatchPaymentDetails
}