const paymentDetailService = require('../services/paymentDetailService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {

    app.post('/paymentDetail/createPaymentDetail',UserAuth,
        await validateFormFields([
            body('account_holder_name')
            .notEmpty()
            .withMessage('Account holder name is required.'),

            body('branch_code')
            .notEmpty()
            .withMessage('Branch code is required.'),

            body('ifsc_code')
            .notEmpty()
            .withMessage('IFSC code is required.'),

            body('account_number')
            .notEmpty()
            .withMessage('Account number is required.'),
        ])
        ,async (req,res,next) => {
        const { account_holder_name, branch_code, bank_name, ifsc_code, account_number } = req.body;

        let user_id = req.user !== undefined ? req.user.user_id : null;
      
        const data = await paymentDetailService.addPaymentDetails({ user_id,account_holder_name, branch_code, bank_name, ifsc_code, account_number }); 

        res.status(data.status_code).json(data);
    });

    app.post('/paymentDetail/updatePaymentDetail',UserAuth,
        await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('Id is required.')
            .isMongoId().withMessage("Id is not valid"),

            body('account_holder_name')
            .notEmpty()
            .withMessage('Account holder name is required.'),

            body('branch_code')
            .notEmpty()
            .withMessage('Branch code is required.'),

            body('ifsc_code')
            .notEmpty()
            .withMessage('IFSC code is required.'),

            body('account_number')
            .notEmpty()
            .withMessage('Account number is required.'),
        ])
        ,async (req,res,next) => {
        const { id, account_holder_name, branch_code, bank_name, ifsc_code, account_number } = req.body;
      
        const data = await paymentDetailService.updatePaymentDetails({ id, account_holder_name, branch_code, bank_name, ifsc_code, account_number }); 

        res.status(data.status_code).json(data);
    });

    app.post('/paymentDetail/getPaymentDetailList', UserAuth,  async (req,res,next) => {

        let user_id = req.user !== undefined ? req.user.user_id : null;
        
        const data = await paymentDetailService.getPaymentDetailsList({ user_id }); 
            
        res.status(data.status_code).json(data);
    }); 

    app.post('/paymentDetail/getPaymentDetail', UserAuth ,
        await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('Id is required.')
            .isMongoId().withMessage("Id is not valid"),
    ]),async (req,res,next) => {
        const { id } = req.body;

        const data = await paymentDetailService.getPaymentDetails({ id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/paymentDetail/deletePaymentDetail', UserAuth ,
        await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('Id is required.')
            .isMongoId().withMessage("Id is not valid"),
    ]),async (req,res,next) => {
        const { id } = req.body;

        const data = await paymentDetailService.deletePaymentDetail({ id }); 

        res.status(data.status_code).json(data);
    });
}
