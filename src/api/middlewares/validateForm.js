const { validationResult } = require('express-validator');
const constants = require('../../utils/constant');

// Middleware for form field validation
module.exports.validateFormFields = async (validations) => {
    return async (req, res, next) => {
        // Execute validations
        await Promise.all(validations.map((validation) => validation.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        let errorArray = [];
        // console.log('errors :: ',errors)
        errors.errors.map((errorList) => {
            const containsField = !!errorArray.find(error => {  
                return error.field_name === errorList.path
            })
            if(containsField === false){
                errorArray.push({
                    field_name: errorList.path,
                    message: errorList.msg
                })
            }
        });

        // Validation errors occurred
        res.status(400).json({
            status: false,
            status_code: constants.ERROR_RESPONSE,
            message: 'Something went to wrong!',
            error: errorArray
        });
    };
};
