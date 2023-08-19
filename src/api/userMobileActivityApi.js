const userMobileActivityService = require('../services/userMobileActivityService');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async(app) => {

    app.post('/activity/openapplication', await validateFormFields([
        body('user_id')
        .optional()
        .isMongoId().withMessage("User id is not valid")
    ]),async (req,res,next) => {
        const {  user_id,device_type,ip_address, device_uuid, firebase_token } = req.body;

        const data = await userMobileActivityService.addUserMobileActivity({  user_id, device_type, ip_address, device_uuid, firebase_token }); 

        res.status(data.status_code).json(data);
    });

    app.post('/activity/closeaplication' ,await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('Id is required.')
        .isMongoId().withMessage("Id is not valid")
    ]),async (req,res,next) => {

        const { id } = req.body;

        const data = await userMobileActivityService.updateUserMobileActivity({ id }); 
            
        res.status(data.status_code).json(data);
    });
}
