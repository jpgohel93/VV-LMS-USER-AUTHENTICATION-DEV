const feedbackService = require('../services/feedbackService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {
    app.post('/feedback/save', UserAuth, await validateFormFields([
        body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid"),

        body('feedback_message')
            .notEmpty()
            .withMessage('Feedback message is required'),
    ]), async (req, res, next) => {

        const { course_id, feedback_message } = req.body;
        const data = await feedbackService.saveFeedback({ course_id, feedback_message }, req);
        res.status(data.status_code).json(data);
    });

    app.post('/feedback/edit', UserAuth, await validateFormFields([
        body('feedback_id')
            .notEmpty()
            .withMessage('Feedback id is required.')
            .isMongoId().withMessage("Feedback id is not valid"),

        body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid"),

        body('feedback_message')
            .notEmpty()
            .withMessage('Feedback message is required'),
    ]), async (req, res, next) => {

        const { course_id, feedback_message, feedback_id } = req.body;
        const data = await feedbackService.updateFeedback({ course_id, feedback_message, feedback_id }, req);
        res.status(data.status_code).json(data);
    });

    app.post('/feedback/fetch', UserAuth, await validateFormFields([
        body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid"),

        body('startToken')
            .isNumeric()
            .withMessage('Enter a valid start token value'),

        body('endToken')
            .notEmpty()
            .withMessage('End token is required')
            .isNumeric()
            .withMessage('Enter a valid end token value')
    ]), async (req, res, next) => {

        const { course_id, startToken, endToken } = req.body;

        const data = await feedbackService.getFeedbackData({ course_id, startToken, endToken }, req);

        res.status(data.status_code).json(data);
    });

    app.post('/feedback/delete', UserAuth ,
        await validateFormFields([
                body('id')
                .notEmpty()
                .withMessage('Feedback id is required.')
                .isMongoId().withMessage("Id is not valid")
        ]),async (req,res,next) => {
        const { id } = req.body;

        const data = await feedbackService.deleteFeedback({ id }); 

        res.status(data.status_code).json(data);
    });
}