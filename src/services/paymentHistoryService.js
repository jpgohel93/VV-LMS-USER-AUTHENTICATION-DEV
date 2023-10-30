const { PaymentHistoryModel, UserCourseModel, InvoiceModel, UserModel } = require("../database");
const constants = require('../utils/constant');
const { CallCourseQueryEvent, CallEventBus } = require('../utils/call-event-bus');

const addPaymentHistory = async (userInputs, request) => {
    try{
        const { user_id, course_id, transaction_id } = userInputs;

        const createPaymentHistory = await PaymentHistoryModel.createPaymentHistory({ 
            user_id: user_id,
            course_id: course_id,
            transaction_id: transaction_id
        });

        if(createPaymentHistory){

            let courseData = await CallCourseQueryEvent("get_course_data_by_id",{ id: course_id }, request.get("Authorization"))

            let finalAmount = 0
            if(courseData){
                finalAmount = courseData.discount_amount
                let taxAmount = 0
                if(courseData.is_tax_exclusive){
                    taxAmount = parseInt(courseData.discount_amount) * parseFloat(courseData.tax_percentage) / 100 
                    finalAmount = finalAmount + taxAmount
                }
            } 

            const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: user_id});
            const getUserData = await UserModel.fatchUserById(user_id);
            let hemanDiscount = 0
            let referralCode = ''
            let basicAmount = finalAmount
            if(getUserData && getUserData?.referral_code && getUserCourseData && getUserCourseData?.length == 0){
                let hemanData = await CallEventBus("get_heman_by_code",{ referral_code: getUserData.referral_code }, request.get("Authorization"))

                if(hemanData?.student_discount){
                    referralCode = getUserData.referral_code
                    hemanDiscount = hemanData.student_discount
                    finalAmount = finalAmount - hemanDiscount
                }
            }
            

            let createInvoiceData = {
                user_id: user_id, 
                course_id: course_id,
                reference_id: null,
                payment_id: transaction_id,
                order_id: null,
                course_type: 'N/A',
                amount: finalAmount,
                purchase_time: new Date(),
                subscription_id: '',
                invoice_type: 2,
                title: "Subscription Charged",
                payment_method: null,
                module_name: "Checkout",
                payment_status: 2,
                referral_code: referralCode,
                referral_amount: hemanDiscount,
                basic_amount: basicAmount
            }
            await InvoiceModel.createInvoice(createInvoiceData);

            PaymentHistoryModel.updatePaymentHistory(createPaymentHistory._id,{
                amount: finalAmount,
                referral_code: referralCode,
                referral_amount: hemanDiscount,
                basic_amount: basicAmount
            })

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
        const { user_id, startToken, endToken, search  } = userInputs;

        const perPage = parseInt(endToken) || 10;
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) {
            page = perPage * page;
        }

        const PaymentHistoryData = await PaymentHistoryModel.fatchPaymentHistoryList({user_id, page, perPage, search});
        const countPaymentHistoryData = await PaymentHistoryModel.countPaymentHistoryList({user_id,search});
        
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
                    data: PaymentHistoryData,
                    total_count: countPaymentHistoryData
                };
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data get successfully",
                    data: PaymentHistoryData,
                    total_count: countPaymentHistoryData
                }
            }
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
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