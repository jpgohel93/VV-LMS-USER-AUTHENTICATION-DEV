const notesService = require('../services/notesService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {

    app.post('/notes/addNotes',UserAuth,
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid"),

            body('time')
            .notEmpty()
            .withMessage('Time is required.'),

            body('topic_id')
            .notEmpty()
            .withMessage('Topic id is required.')
            .isMongoId().withMessage("Topic id is not valid"),

            body('description')
            .notEmpty()
            .withMessage('Description is required.'),
        ])
        ,async (req,res,next) => {
        const { user_id, course_id,chapter_id, topic_id, description, title, time } = req.body;
      
        const data = await notesService.addNotes({ user_id, course_id,chapter_id, topic_id, description, title, time }); 

        res.status(data.status_code).json(data);
    });

    app.post('/notes/updateNotes',UserAuth,
        await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('Id is required.')
            .isMongoId().withMessage("Id is not valid"),

            body('description')
            .notEmpty()
            .withMessage('Description is required.'),
        ])
        ,async (req,res,next) => {
        const { id, description } = req.body;
      
        const data = await notesService.updateNotes({ id, description }); 

        res.status(data.status_code).json(data);
    });

    app.post('/notes/getNotesList', UserAuth , await validateFormFields([
        body('startToken')
          .notEmpty()
          .isNumeric()
          .withMessage('Enter a valid start token value'),
    
        body('endToken')
          .notEmpty()
          .isNumeric()
          .withMessage('Enter a valid end token value')
      ]), async (req,res,next) => {

        const { user_id, course_id, chapter_id, topic_id, startToken, endToken } = req.body;

        
        const data = await notesService.getNotesData({ user_id, course_id,chapter_id, topic_id, startToken, endToken }, req); 
            
        res.status(data.status_code).json(data);
    }); 

    app.post('/notes/deleteNotesItem', UserAuth ,
        await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("Id is not valid"),
    ]),async (req,res,next) => {
        const { id } = req.body;

        const data = await notesService.deleteNotesItem({ id }); 

        res.status(data.status_code).json(data);
    });
}
