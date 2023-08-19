const userEventService = require('../services/userEventService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {
    app.post('/event/getEventList',UserAuth, await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required.')
        .isMongoId().withMessage("User id is not valid"),
    
        body('startToken')
        .isNumeric()
        .withMessage('Enter a valid start token value'),
    
        body('endToken')
        .notEmpty()
        .isNumeric()
        .withMessage('Enter a valid end token value')
    ]), async (req,res,next) => {
        
        const { startToken, endToken, user_event_type, user_id } = req.body;
        const data = await userEventService.getUserEventList({ startToken, endToken, user_event_type, user_id }, req); 
        res.status(data.status_code).json(data);
    });

    app.post('/event/joinUserToEvent',UserAuth, await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required.')
        .isMongoId().withMessage("User id is not valid"),
    
        body('event_id')
        .notEmpty()
        .withMessage('Event id is required.')
    ]), async (req,res,next) => {

        const { event_id, user_id } = req.body;
        const data = await userEventService.joinUserToEvent({ event_id, user_id }, req); 
        res.status(data.status_code).json(data);
    });
}