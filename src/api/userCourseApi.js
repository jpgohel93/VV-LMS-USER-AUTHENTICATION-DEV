const userCourseService = require('../services/userCourseService');
const paymentHistoryService = require('../services/paymentHistoryService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');

module.exports = async (app) => {
    app.post('/user/assignCourse',UserAuth ,
        await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not vlaid"),

            body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid")
        ])
        ,async (req,res,next) => {

        const { user_id, course_id, duration, duration_time } = req.body;

        const data = await userCourseService.assignCourse({ user_id, course_id, duration, duration_time }, req); 
        res.status(data.status_code).json(data);
    });

    app.post('/user/assignCourseList',UserAuth, await validateFormFields([
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

        const { user_id, startToken, endToken, course_subscription_type } = req.body;
        
        const data = await userCourseService.getAssignCourseList({ user_id, startToken, endToken, course_subscription_type },req); 

        res.status(data.status_code).json(data);
    });

    app.post('/user/deleteUserCourse', UserAuth, await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid")
        ]), async (req,res,next) => {

        const { id } = req.body;
        
        const data = await userCourseService.deleteUserCourse({ id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/user/updateAssignCourse',UserAuth , await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('Id is required.')
            .isMongoId().withMessage("Id is not valid"),

            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid")
        ]), async (req,res,next) => {

        const { id, user_id,user_title, course_id, allowed_enrollment, duration, duration_time } = req.body;
        
        const data = await userCourseService.updateAssignCourse({ id, user_id,user_title, course_id, allowed_enrollment, duration, duration_time }); 
        res.status(data.status_code).json(data);
    });

    app.post('/user/getAssignCourseById',UserAuth ,await validateFormFields([
            body('id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("Id is not valid")
        ]), async (req,res,next) => {

        const { id } = req.body;
        
        const data = await userCourseService.getAssignCourseById({ id }); 
        res.status(data.status_code).json(data);
    }); 

    app.post('/user/purchaseCourse',UserAuth ,await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid")
        ]), async (req,res,next) => {
        const { user_id, course_id, subscription_type, coupon_code } = req.body;
        const data = await userCourseService.purchaseCourse({ user_id, course_id , subscription_type, coupon_code}, req); 
        res.status(data.status_code).json(data);
    });

    app.post('/user/mylearning',UserAuth ,await validateFormFields([
            body('user_id')
            .notEmpty()
            .withMessage('User id is required.')
            .isMongoId().withMessage("User id is not valid"),

            body('page_type')
            .notEmpty()
            .withMessage('Page type is required.')
        ]), async (req,res,next) => {

        const { user_id, page_type } = req.body;
        
        const data = await userCourseService.mylearning({ user_id, page_type },req); 

        res.status(data.status_code).json(data);
    });

    app.post('/user/countCourseUser',UserAuth ,await validateFormFields([
        body('course_id')
        .notEmpty()
        .withMessage('Course id is required.')
        .isMongoId().withMessage("Course id is not valid")
    ]), async (req,res,next) => {

        const { course_id } = req.body;
       
        const data = await userCourseService.countCourseUser({ course_id }); 

        res.json(data);
    });

    app.post('/user/getPaymentResponse',UserAuth , await validateFormFields([
        body('order_id')
        .notEmpty()
        .withMessage('Order id is required.'),
    
        body('payment_response')
        .notEmpty()
        .withMessage('Payment response is required.')
    ]), async (req,res,next) => {

        const { order_id, payment_status, payment_response } = req.body;
       
        const data = await userCourseService.coursePaymentResponse({ order_id, payment_status, payment_response }); 

        res.json(data);
    });

    app.post('/user/checkUserSubscription',UserAuth ,
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

        const data = await userCourseService.checkCourseSubscription({ user_id, course_id }); 
        res.json(data);
    });

    app.post('/user/cancelCourseSubscription',UserAuth ,await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required.')
        .isMongoId().withMessage("User id is not valid"),

        body('course_id')
        .notEmpty()
        .withMessage('Course id is required.')
        .isMongoId().withMessage("Course id is not valid")
    ]), async (req,res,next) => {


    const { user_id, course_id } = req.body;
   
    const data = await userCourseService.cancelCourseSubscription({ user_id, course_id}, req); 
    res.status(data.status_code).json(data);
    });

    app.post('/user/paymentHistory',UserAuth ,await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required.')
        .isMongoId().withMessage("User id is not valid"),
    
        body('startToken')
        .isNumeric()
        .withMessage('Enter a valid start token value'),
    
        body('endToken')
        .notEmpty()
        .withMessage('End token is required.')
        .isNumeric()
        .withMessage('Enter a valid end token value'),

        body('type')
        .notEmpty()
        .withMessage('Type is required.')
        .isNumeric()
        .withMessage('Select a valid type')
    ]), async (req,res,next) => {

        const { user_id, startToken, endToken, type } = req.body;
    
        const data = await userCourseService.getPaymentHistory({ user_id, startToken, endToken, type }, req); 
        res.status(data.status_code).json(data);
    });

    app.post('/user/invoice',UserAuth ,await validateFormFields([
        body('invoice_id')
        .notEmpty()
        .withMessage('Invoice id is required.'),

        body('user_id')
        .notEmpty()
        .withMessage('User id is required.')
        .isMongoId().withMessage("User id is not valid"),
    ]), async (req,res,next) => {


    const { invoice_id, user_id } = req.body;
   
    const data = await userCourseService.getInvoice({ invoice_id, user_id }, req); 
        res.status(data.status_code).json(data);
    });

    app.post('/user/paymenturl',UserAuth ,await validateFormFields([
        body('course_id')
        .notEmpty()
        .withMessage('Course id is required.')
        .isMongoId().withMessage("Course id is not valid")
    ]), async (req,res,next) => {
        const {course_id } = req.body;

        let user_id = req.user !== undefined ? req.user.user_id : null;

        const data = await userCourseService.singleTimePayment({ user_id, course_id}, req); 
        res.status(data.status_code).json(data);
    });

    app.post('/user/paymentResponse', async (req,res,next) => {

        const data = await userCourseService.paymentResponse(req, res);

        if(data?.payment_status == "Success"){
            res.redirect(process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_SUCCESS_URL_TESTING + data?.course_id + "/?p=success" : process.env.CCAVENUE_SUCCESS_URL + data?.course_id + "/?p=success" );
        }else if(data.payment_status == "Failure"){
            res.redirect(process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_FAILURE_URL_TESTING + data?.course_id + "/?p=fail"  : process.env.CCAVENUE_FAILURE_URL + data?.course_id + "/?p=fail" );
        }else{
            res.redirect(process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_FAILURE_URL_TESTING : process.env.CCAVENUE_FAILURE_URL);
        }
        
    });

    app.post('/user/addPaymentTransaction', await validateFormFields([
        body('course_id')
            .notEmpty()
            .withMessage('Course id is required.')
            .isMongoId().withMessage("Course id is not valid"),

        body('transaction_id')
            .notEmpty()
            .withMessage('Transactopn id is required'),
    ]), UserAuth ,async (req,res,next) => {
        const { course_id, transaction_id } = req.body;
        let user_id = req.user !== undefined ? req.user.user_id : null; 

        const data = await paymentHistoryService.addPaymentHistory({ course_id , user_id, transaction_id }, req); 

        res.status(data.status_code).json(data);
    });

    app.post('/user/getPaymentHistory', UserAuth ,async (req,res,next) => {
        const { user_id, startToken, endToken ,search} = req.body;

        const data = await paymentHistoryService.getPaymentHistoryData({ user_id, startToken, endToken ,search}, req); 

        res.status(data.status_code).json(data);
    });

    app.post('/user/testSubscription', async (req, res, next) => {
       
        const data = await userCourseService.testSubscription();

        res.status(200).json(data);
    });

    app.post('/user/getUserEarningHistory', UserAuth ,async (req,res,next) => {
        const { startToken, endToken, transaction_type} = req.body;
        let user_id = req.user !== undefined ? req.user.user_id : null; 

        const data = await userCourseService.getUserEarningHistory({ user_id, startToken, endToken, transaction_type }); 

        res.status(data.status_code).json(data);
    });
}