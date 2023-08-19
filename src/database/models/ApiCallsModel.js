const { ApiCallsSchema } = require('../schema');

const createApiCall = async (insertData) => {

    const apiCall = new ApiCallsSchema(insertData)

    const apiCallResult = await apiCall.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return apiCallResult;
}

const updateApiCall = async (id,updateData) => {

    const apiCallResult =  await ApiCallsSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return apiCallResult;
}
module.exports = {
    createApiCall,
    updateApiCall
}