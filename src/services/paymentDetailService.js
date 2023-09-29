const { PaymentDetailModel } = require("../database");
const constants = require('../utils/constant');

const addPaymentDetails = async (userInputs) => {

    try{
        const { user_id, account_holder_name, branch_code, bank_name, ifsc_code, account_number } = userInputs;

        let paymentData = await PaymentDetailModel.createPaymentDetail({ 
            user_id: user_id, 
            account_holder_name: account_holder_name,
            branch_code: branch_code, 
            bank_name: bank_name,
            ifsc_code:  ifsc_code,
            account_number: account_number
        });
       
        if(paymentData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Payment details added successfully",
                id: paymentData._id
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Falied to add a payment details"
            };
        }
    } catch (error) {
        // Handle unexpected errors
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const updatePaymentDetails = async (userInputs) => {

    try{
        const { id, account_holder_name, branch_code, bank_name, ifsc_code, account_number } = userInputs;

        let paymentData = await PaymentDetailModel.updatePaymentDetail(id,{
            account_holder_name: account_holder_name,
            branch_code: branch_code, 
            bank_name: bank_name,
            ifsc_code:  ifsc_code,
            account_number: account_number
        });
       
        if(paymentData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Payment details updated successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Falied to update a payment details"
            };
        }
    } catch (error) {
        // Handle unexpected errors
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getPaymentDetails = async (userInputs) => {

    try{
        const { id } = userInputs;

        const PaymentDetailsData = await PaymentDetailModel.fatchPaymentDetailById(id);

        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data get successfully",
            data: PaymentDetailsData
        };
    } catch (error) {
        // Handle unexpected errors
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getPaymentDetailsList = async (userInputs) => {

    try{
        const { user_id } = userInputs;

        const PaymentDetailsData = await PaymentDetailModel.fatchPaymentDetails(user_id);

        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data get successfully",
            data: PaymentDetailsData
        };
    } catch (error) {
        // Handle unexpected errors
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const deletePaymentDetail = async (userInputs) => {

    try{
        const { id } = userInputs;

        let paymentData = await PaymentDetailModel.updatePaymentDetail(id,{
            is_deleted: true
        });
       
        if(paymentData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Payment details deleted successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Falied to delete a payment details"
            };
        }
    } catch (error) {
        // Handle unexpected errors
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

module.exports = {
    updatePaymentDetails,
    addPaymentDetails,
    getPaymentDetails,
    getPaymentDetailsList,
    deletePaymentDetail
}