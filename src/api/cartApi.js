const cartService = require('../services/cartService');
const UserAuth = require('./middlewares/auth');
const { validateFormFields } = require('./middlewares/validateForm');
const { body } = require('express-validator');


module.exports = async (app) => {

    app.post('/cart/addToCart',UserAuth,
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

        const data = await cartService.addCart({ user_id, course_id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/cart/getCartList', UserAuth,
        await validateFormFields([
                body('user_id')
                .notEmpty()
                .withMessage('User id is required.')
                .isMongoId().withMessage("User id is not valid")
        ])
        ,async (req,res,next) => {

        const { user_id } = req.body;

        const data = await cartService.getCartsData({ user_id }, req); 
            
        res.status(data.status_code).json(data);
    });

    app.post('/cart/deleteCartItem', UserAuth ,
        await validateFormFields([
                body('id')
                .notEmpty()
                .withMessage('Cart item id is required.')
                .isMongoId().withMessage("Id is not valid")
        ])
        ,async (req,res,next) => {
        const { id } = req.body;

        const data = await cartService.deleteCartItem({ id }); 

        res.status(data.status_code).json(data);
    });

    app.post('/cart/checkOut', UserAuth ,async (req,res,next) => {
        const { course_id, coupon_code } = req.body;
       // let user_id = req.user !== undefined ? req.user.user_id : null;
        let user_id = "65126ff7d7141f316d951713";

        const data = await cartService.checkOut({ course_id , user_id, coupon_code }, req); 

        res.status(data.status_code).json(data);
    });
    
    app.post('/cart/qrCheckOut', UserAuth ,async (req,res,next) => {
        const { course_id } = req.body;
        let user_id = req.user !== undefined ? req.user.user_id : null;

        const data = await cartService.qrCheckOut({ course_id , user_id }, req); 

        res.status(data.status_code).json(data);
    });

    app.post('/cart/courseCheckOut', UserAuth ,async (req,res,next) => {
        const { course_id } = req.body;
        let user_id = req.user !== undefined ? req.user.user_id : null;

        const data = await cartService.courseCheckOut({ course_id , user_id }, req); 

        res.status(data.status_code).json(data);
    });

    app.post('/cart/applyCoupon', UserAuth ,async (req,res,next) => {
        const { course_id, coupon_code } = req.body;
        let user_id = req.user !== undefined ? req.user.user_id : null;

        const data = await cartService.applyCoupon({ course_id , user_id, coupon_code }, req); 

        res.status(data.status_code).json(data);
    });
}
