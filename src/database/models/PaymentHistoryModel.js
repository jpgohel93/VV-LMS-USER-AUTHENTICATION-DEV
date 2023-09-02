const { PaymentHistorySchema } = require('../schema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const createPaymentHistory = async (insertData) => {

    const PaymentHistory = new PaymentHistorySchema(insertData)

    const PaymentHistoryResult = await PaymentHistory.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return PaymentHistoryResult;
}

const updatePaymentHistory = async (id,updateData) => {

    const paymentLog = PaymentHistorySchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return paymentLog;
}


const fatchPaymentHistoryList = async (userInput) => {

    let filter = [];
    if(userInput.user_id){
        filter.push({
            user_id: new ObjectId(userInput.user_id)
        })
    }

    if(userInput.course_id){
        filter.push({
            course_id: userInput.course_id
        })
    }
    
    let filterData = [{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_data',
                pipeline: [{$project: {_id: 0, first_name: 1,last_name: 1, country_code: 1, mobile_no: 1, email: 1}}]
            }
        },
        {
            $unwind: '$user_data'
        }
    ]
    if(filter.length >0 ){
        filterData.push({
            $match: {
                $and: filter
            }
        })
    }

    const PaymentHistoryData = await PaymentHistorySchema.aggregate(filterData).skip(userInput.page).limit(userInput.perPage).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return PaymentHistoryData;
}

const countPaymentHistoryList = async (userInput) => {

    let filter = [];
    if(userInput.user_id){
        filter.push({
            user_id: new ObjectId(userInput.user_id)
        })
    }

    if(userInput.course_id){
        filter.push({
            course_id: userInput.course_id
        })
    }
    
    let filterData = [{
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_data',
                pipeline: [{$project: {_id: 0, first_name: 1,last_name: 1, country_code: 1, mobile_no: 1, email: 1}}]
            }
        },
        {
            $unwind: '$user_data'
        }
    ]
    if(filter.length >0 ){
        filterData.push({
            $match: {
                $and: filter
            }
        })
    }

    const PaymentHistoryData = await PaymentHistorySchema.aggregate(filterData).then((data) => {
        return data?.length || 0 
    }).catch((err) => {
        return null
    });
    return PaymentHistoryData;
}




module.exports = {
    createPaymentHistory,
    fatchPaymentHistoryList,
    countPaymentHistoryList,
    updatePaymentHistory
}