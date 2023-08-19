const userActivityService  = require('../services/userActivityService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {
    app.post('/useractivity/addUserActivity',UserAuth, await validateFormFields([
        body('module')
        .notEmpty()
        .withMessage('Module is required')
        .isMongoId().withMessage("User id is not valid"),
    ]), async (req,res,next) => {
        
        const { module, reference_id } = req.body;
        let user_id = req.user !== undefined ? req.user.user_id : null;

        const data = await userActivityService.addUserActivity({ module, reference_id, user_id: user_id }); 
        res.status(data.status_code).json(data);
    });

    app.post('/useractivity/updateUserActivity',UserAuth, await validateFormFields([
        body('activity_id')
        .notEmpty()
        .withMessage('Activity id is required')
        .isMongoId().withMessage("Activity id is not valid"),
    ]), async (req,res,next) => {
        
        const { activity_id, end_time } = req.body;
        const data = await userActivityService.updateUserActivity({ activity_id, end_time  }); 
        res.status(data.status_code).json(data);
    });

    app.post('/useractivity/dailyLearning',UserAuth, await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("User id is not valid"),

        body('course_id')
        .notEmpty()
        .withMessage('Course id is required')
        .isMongoId().withMessage("Course id is not valid")
    ]), async (req,res,next) => {
        
        const { user_id, course_id } = req.body;
        const data = await userActivityService.dailyLearning({ user_id, course_id  }); 
        res.status(data.status_code).json(data);
    });

    app.post('/useractivity/timeSpendByModule',UserAuth, await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("User id is not valid")
    ]), async (req,res,next) => {
        
        const { user_id } = req.body;
        const data = await userActivityService.timeSpendByModule({ user_id }); 
        res.status(data.status_code).json(data);
    });

    app.post('/useractivity/subjectTimeSpend',UserAuth, await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("User id is not valid"),

        body('chapter_id')
        .notEmpty()
        .withMessage('Chapter id is required')
        .isMongoId().withMessage("Chapter id is not valid")
    ]), async (req,res,next) => {
        
        const { user_id, chapter_id } = req.body;
        const data = await userActivityService.subjectTimeSpend({ user_id, chapter_id }); 
        res.status(data.status_code).json(data);
    });
}