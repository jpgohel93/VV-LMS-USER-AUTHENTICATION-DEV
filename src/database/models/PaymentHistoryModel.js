const { PaymentHistorySchema } = require('../schema');

const createPaymentHistory = async (insertData) => {

    const PaymentHistory = new PaymentHistorySchema(insertData)

    const PaymentHistoryResult = await PaymentHistory.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return PaymentHistoryResult;
}

const fatchPaymentHistoryList = async (userInput) => {

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
    
    let filterData = {}
    if(filter.length >0 ){
        filterData = { 
            $and: filter
        }
    }

    const PaymentHistoryData = await PaymentHistorySchema.aggregate([
        {
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
    ]).skip(userInput.page).limit(userInput.perPage).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return PaymentHistoryData;
}



module.exports = {
    createPaymentHistory,
    fatchPaymentHistoryList
}