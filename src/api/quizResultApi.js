const quizresultService = require('../services/quizResultService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {

    app.post('/quizresult/addQuizResult',UserAuth, 
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('type')
            .notEmpty()
            .withMessage('Type is required.'),
        ]),async (req,res,next) => {

        const { user_id, quiz_id, total_score, total_questions, time_left, total_attemped, total_unattemped, total_marked, total_skipped, total_wrong, total_correct,
            time_taken, accutacy, score_archive, answers, quiz_result, type, course_id, topic_id} = req.body;


        const data = await quizresultService.addQuizResult({ user_id, quiz_id, total_score, total_questions, time_left, total_attemped, total_unattemped, total_marked, total_skipped, total_wrong, total_correct,
            time_taken, accutacy, score_archive, answers, quiz_result, type, course_id, topic_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/quizresult/getQuizResultList', UserAuth,
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),
        ])
        ,async (req,res,next) => {

        const { user_id, type } = req.body;

        const data = await quizresultService.getQuizResultsData({ user_id, type }, req); 
            
        res.status(data.status_code).json(data);
    });

    app.post('/quizresult/getQuizResult', UserAuth,
        await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('Id is required.')
            .isMongoId().withMessage("Id is not valid"),,
        ])
        ,async (req,res,next) => {

        const { id } = req.body;

        const data = await quizresultService.getQuizResults({ id }, req); 
            
        res.status(data.status_code).json(data);
    });

    app.post('/quizresult/deleteQuizResult', UserAuth ,
    await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('Id is required.')
        .isMongoId().withMessage("Id is not valid")
    ]),async (req,res,next) => {

        const { id } = req.body;

        const data = await quizresultService.deleteQuizResult({ id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/quizresult/getUserQuizResult', UserAuth ,await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required.')
        .isMongoId().withMessage("User id is not valid"),

        body('quiz_id')
        .notEmpty()
        .withMessage('Quiz id is required.')
        .isMongoId().withMessage("Quiz id is not valid")
    ]),async (req,res,next) => {
        const { user_id, type, quiz_id } = req.body;

        const data = await quizresultService.getReportQuizResult({ user_id, type, quiz_id }); 

        res.status(data.status_code).json(data);
    });
}
