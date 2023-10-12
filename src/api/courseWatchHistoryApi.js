const CourseWatchHistoryService = require('../services/courseWatchHistoryService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {

    app.post('/coursewatchhistory/addToCourseWatchHistory',UserAuth,
        await validateFormFields([
                body('user_id')
                .notEmpty()
                .withMessage('User id is required.')
                .isMongoId().withMessage("User id is not valid"),

                body('course_id')
                .notEmpty()
                .withMessage('Course id is required.')
                .isMongoId().withMessage("Course id is not valid"),
        ])
        ,async (req,res,next) => {
        const { user_id, course_id } = req.body;

        const data = await CourseWatchHistoryService.addCourseWatchHistory({ user_id, course_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/addCourseChapterWatchHistory',UserAuth,
        await validateFormFields([
                body('user_id')
                .notEmpty()
                .withMessage('User id is required.')
                .isMongoId().withMessage("User id is not valid"),

                body('course_id')
                .notEmpty()
                .withMessage('Course id is required.')
                .isMongoId().withMessage("Course id is not valid"),

                body('chapter_id')
                .notEmpty()
                .withMessage('Chapter id is required.')
                .isMongoId().withMessage("Chapter id is not valid"),

                body('topic_id')
                .notEmpty()
                .withMessage('Topic id is required.')
                .isMongoId().withMessage("Topic id is not valid"),
        ])
        ,async (req,res,next) => {
        const { user_id, course_id, chapter_id, topic_id } = req.body;

        const data = await CourseWatchHistoryService.addCourseChapterWatchHistory({ user_id, course_id, chapter_id, topic_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/addCourseTopicWatchHistory',UserAuth,
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid"),

            body('topic_id')
            .notEmpty()
            .withMessage('Topic id is required.')
            .isMongoId().withMessage("Topic id is not valid"),
        ])
        ,async (req,res,next) => {
        const { user_id, course_id, topic_id,view_completed_time } = req.body;

        const data = await CourseWatchHistoryService.addCourseTopicWatchHistory({ user_id, course_id, topic_id, view_completed_time }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/addCompletedChapter',UserAuth,
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid"),

            body('chapter_id')
            .notEmpty()
            .withMessage('Chapter id is required.')
            .isMongoId().withMessage("Chapter id is not valid"),
        ])
        ,async (req,res,next) => {
        const { user_id, course_id, chapter_id } = req.body;

        const data = await CourseWatchHistoryService.addCompletedChapter({ user_id, course_id, chapter_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/addCompletedTopic',UserAuth,
        await validateFormFields([
                body('user_id')
                .notEmpty()
                .withMessage('User id is required.')
                .isMongoId().withMessage("User id is not valid"),

                body('course_id')
                .notEmpty()
                .withMessage('Course id is required.')
                .isMongoId().withMessage("User id is not valid"),

                body('topic_id')
                .notEmpty()
                .withMessage('Topic id is required.')
                .isMongoId().withMessage("Topic id is not valid"),
        ])
        ,async (req,res,next) => {
        const { user_id, course_id, topic_id } = req.body;

        const data = await CourseWatchHistoryService.addCompletedTopic({ user_id, course_id, topic_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/getCourseWatchHistoryList', UserAuth ,
        await validateFormFields([
                body('user_id')
                .notEmpty()
                .withMessage('User id is required.')
                .isMongoId().withMessage("User id is not valid")
        ])
        ,async (req,res,next) => {

        const { user_id } = req.body;

        const data = await CourseWatchHistoryService.getCourseWatchHistorysData({ user_id }, req); 
            
        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/deleteCourseWatchHistoryItem', UserAuth,
        await validateFormFields([
                body('id') 
                .notEmpty()
                .withMessage('Id is required.')
                .isMongoId().withMessage("Id is not valid")
        ])
        ,async (req,res,next) => {
        const { id } = req.body;

        const data = await CourseWatchHistoryService.deleteCourseWatchHistoryItem({ id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/getCourseWatchHistory', UserAuth,
        await validateFormFields([
                body('user_id')
                .notEmpty()
                .withMessage('User id is required.')
                .isMongoId().withMessage("User id is not valid"),

                body('course_id')
                .notEmpty()
                .withMessage('Course id is required.')
                .isMongoId().withMessage("Course id is not valid")
        ])
        ,async (req,res,next) => {
        const { user_id, course_id } = req.body;

        const data = await CourseWatchHistoryService.getSingleCourseWatchHistory({ user_id, course_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/getCourseWatchHistoryWithPagination', UserAuth,
        await validateFormFields([
                body('user_id')
                .notEmpty()
                .withMessage('User id is required.')
                .isMongoId().withMessage("User id is not valid"),

                body('course_id')
                .notEmpty()
                .withMessage('Course id is required.')
                .isMongoId().withMessage("Course id is not valid")
        ])
        ,async (req,res,next) => {
        const { user_id, course_id, startToken, endToken} = req.body;

        const data = await CourseWatchHistoryService.getCourseWatchHistoryWithPagination({ user_id, course_id, startToken, endToken }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/makeCourseAsACompleted',UserAuth,
        await validateFormFields([
                body('user_id')
                .notEmpty()
                .withMessage('User id is required.')
                .isMongoId().withMessage("User id is not valid"),

                body('course_id')
                .notEmpty()
                .withMessage('Course id is required.')
                .isMongoId().withMessage("Course id is not valid")
        ])
        ,async (req,res,next) => {
        const { user_id, course_id } = req.body;

        const data = await CourseWatchHistoryService.makeCourseAsACompleted({ user_id, course_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/addChapterViewHistory',UserAuth,await validateFormFields([
        body('course_id')
        .notEmpty()
        .withMessage('Course id is required.')
        .isMongoId().withMessage("Course id is not valid"),

        body('chapter_id')
        .notEmpty()
        .withMessage('Chapter id is required.')
        .isMongoId().withMessage("Chapter id is not valid")
    ]),async (req,res,next) => {
        const { course_id, chapter_id } = req.body;

        let userId = req?.user?.user_id ? req?.user?.user_id : null

        const data = await CourseWatchHistoryService.addChapterViewHistory({ user_id: userId, course_id, chapter_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/addTopicViewHistory',UserAuth,await validateFormFields([
        body('course_id')
        .notEmpty()
        .withMessage('Course id is required.')
        .isMongoId().withMessage("Course id is not valid"),

        body('chapter_id')
        .notEmpty()
        .withMessage('Chapter id is required.')
        .isMongoId().withMessage("Chapter id is not valid"),

        body('topic_id')
        .notEmpty()
        .withMessage('Topic id is required.')
        .isMongoId().withMessage("Topic id is not valid")
    ]),async (req,res,next) => {
        const { course_id, chapter_id, topic_id  } = req.body;

        let userId = req?.user?.user_id ? req?.user?.user_id : null

        const data = await CourseWatchHistoryService.addTopicViewHistory({ user_id: userId, course_id, chapter_id, topic_id  }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/topicCompleted',UserAuth,await validateFormFields([
        body('course_id')
        .notEmpty()
        .withMessage('Course id is required.')
        .isMongoId().withMessage("Course id is not valid"),

        body('chapter_id')
        .notEmpty()
        .withMessage('Chapter id is required.')
        .isMongoId().withMessage("Chapter id is not valid"),

        body('topic_id')
        .notEmpty()
        .withMessage('Topic id is required.')
        .isMongoId().withMessage("Topic id is not valid")
    ]),async (req,res,next) => {
        const { course_id, chapter_id, topic_id  } = req.body;

        let userId = req?.user?.user_id ? req?.user?.user_id : null

        const data = await CourseWatchHistoryService.topicCompleted({ user_id: userId, course_id, chapter_id, topic_id  }); 

        res.status(data.status_code).json(data);
    });

    app.post('/coursewatchhistory/getTopicViewHistory',UserAuth,await validateFormFields([
        body('course_id')
        .notEmpty()
        .withMessage('Course id is required.')
        .isMongoId().withMessage("Course id is not valid")
    ]),async (req,res,next) => { 
        const { course_id, chapter_id  } = req.body;

        let userId = req?.user?.user_id ? req?.user?.user_id : null

        const data = await CourseWatchHistoryService.getTopicViewHistory({ user_id: userId, course_id, chapter_id  }); 

        res.status(data.status_code).json(data);
    });
}
