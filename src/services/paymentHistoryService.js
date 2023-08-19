const { PaymentHistoryModel, UserCourseModel } = require("../database");
const constants = require('../utils/constant');

const addPaymentHistory = async (userInputs) => {
    try{
        const { user_id, course_id, transaction_id } = userInputs;

        const createPaymentHistory = await PaymentHistoryModel.createPaymentHistory({ 
            user_id: user_id,
            course_id: course_id,
            transaction_id: transaction_id
        });

        if(createPaymentHistory){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Transaction added successfully",
                id: createPaymentHistory._id
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to add the transaction detail",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addPaymentHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the PaymentHistory into course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getPaymentHistoryData = async (userInputs, request) => {

    try {
        const { user_id, startToken, endToken  } = userInputs;

        const perPage = parseInt(endToken) || 10;
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) {
            page = perPage * page;
        }

        const PaymentHistoryData = await PaymentHistoryModel.fatchPaymentHistoryList({user_id, page, perPage});
        
        if(PaymentHistoryData){

            if(PaymentHistoryData.length > 0){
            
                await Promise.all(
                    await PaymentHistoryData.map(async (PaymentHistoryElement, PaymentHistoryKey) => {
                        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id: PaymentHistoryElement.user_id, course_id: PaymentHistoryElement.course_id});
                        
                        let isPurchase = false
                        if(getFilterData && getFilterData?.type){
                            if(getFilterData.type == 1){
                                isPurchase = true
                            }else{
                                if(getFilterData.type == 2 && getFilterData.payment_status == 2 && getFilterData.is_cancle_subscription == false){
                                    isPurchase = true
                                }
                            }
                        }

                         PaymentHistoryData[PaymentHistoryKey]['is_assign_course'] = isPurchase
                    })
                )

                return  {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data get successfully",
                    data: PaymentHistoryData
                };
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data get successfully",
                    data: PaymentHistoryData
                }
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getPaymentHistoryData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch nodes',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}


module.exports = {
    addPaymentHistory,
    getPaymentHistoryData,
}