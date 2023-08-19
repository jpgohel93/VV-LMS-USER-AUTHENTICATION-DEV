const personalizedQuizService = require('../services/personalizedQuizService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {

    app.post('/personalizedquiz/addQuiz',UserAuth,
        await validateFormFields([
            body('quiz_title')
            .notEmpty()
            .withMessage('Quiz title is required')
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid quiz title'),

            body('question_limit')
            .optional().isNumeric()
            .withMessage('Enter a select valid question limit')
    ]),async (req,res,next) => {

        let userId = req?.user?.user_id ? req?.user?.user_id : null

        const { quiz_title, time_limit, question_limit, questions , tags, is_time_limit} = req.body;

        const data = await personalizedQuizService.addQuiz({ user_id: userId, quiz_title, time_limit, question_limit, questions , tags, is_time_limit}); 

        res.json(data);
    });

    app.post('/personalizedquiz/updateQuiz',UserAuth,
        await validateFormFields([
            body('quiz_id')
            .notEmpty()
            .withMessage('Quiz id is required.')
            .isMongoId().withMessage("Quiz id is not valid"),


            body('total_score')
            .optional().isNumeric()
            .withMessage('Enter a valid total score'),

            body('total_questions')
            .optional().isNumeric()
            .withMessage('Enter a valid total questions score'),

            body('total_attemped')
            .optional().isNumeric()
            .withMessage('Enter a valid total attemped score'),

            body('total_unattemped')
            .optional().isNumeric()
            .withMessage('Enter a valid total unattemped score'),

            body('total_marked')
            .optional().isNumeric()
            .withMessage('Enter a valid total marked score'),

            body('total_skipped')
            .optional().isNumeric()
            .withMessage('Enter a valid total skipped score'),

            body('total_wrong')
            .optional().isNumeric()
            .withMessage('Enter a valid total wrong score'),

            body('total_correct')
            .optional().isNumeric()
            .withMessage('Enter a valid total correct score')
        ])
        ,async (req,res,next) => {

        const { quiz_id, total_score, total_questions, time_left, total_attemped, total_unattemped, total_marked, total_skipped, total_wrong, total_correct,
            time_taken, accutacy, score_archive, answers, quiz_result } = req.body;

        const data = await personalizedQuizService.updateQuiz({ quiz_id, total_score, total_questions, time_left, total_attemped, total_unattemped, total_marked, total_skipped, total_wrong, total_correct,
            time_taken, accutacy, score_archive, answers, quiz_result }); 

        res.status(data.status_code).json(data);
    });

    app.post('/personalizedquiz/getQuizList', UserAuth,
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid")
        ])
        ,async (req,res,next) => {

        const { user_id } = req.body;

        const data = await personalizedQuizService.getQuizData({ user_id }); 
            
        res.status(data.status_code).json(data);
    });

    app.post('/personalizedquiz/getQuiz', UserAuth,
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('quiz_id')
            .notEmpty()
            .withMessage('Quiz id is required.')
            .isMongoId().withMessage("Quiz id is not valid")
        ])
        ,async (req,res,next) => {

        const { user_id, quiz_id } = req.body;

        const data = await personalizedQuizService.getQuiz({ user_id, quiz_id }); 
            
        res.status(data.status_code).json(data);
    });

    app.post('/personalizedquiz/getQuizResult', UserAuth,
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('quiz_id')
            .notEmpty()
            .withMessage('Quiz id is required.')
            .isMongoId().withMessage("Quiz id is not valid")
        ])
        ,async (req,res,next) => {

        const { user_id, quiz_id } = req.body;

        const data = await personalizedQuizService.getQuizResult({ user_id, quiz_id }); 
            
        res.status(data.status_code).json(data);
    });

}
