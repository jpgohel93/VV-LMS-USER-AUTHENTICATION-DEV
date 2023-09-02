const userService = require('../services/userService');
const UserAuth = require('./middlewares/auth');
const {
    createS3Client
} = require('../utils/aws');
const {
    GetUserLocation
} = require('../utils');
const {
    validateFormFields
} = require('./middlewares/validateForm');
const {
    body
} = require('express-validator');


module.exports = async (app) => {
    let uploadFile = await createS3Client("user");

    app.post('/user/singin', await validateFormFields([
        body('username')
        .notEmpty()
        .withMessage('Username is required')
        .custom((value) => {
            let email = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i
            let mobileNo = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/

            if (!mobileNo.test(value) && !email.test(value)) {
                throw new Error("Invaild Email / Mobile Number")
            }
            return true
        }),

        body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        })
        .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),

        body('ip_address')
        .notEmpty()
        .withMessage('IP Address is required'),


        body('operating_system')
        .optional()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('OS must be alphabetic only')
    ]), async (req, res, next) => {

        const {
            username,
            password,
            device_uuid,
            firebase_token,
            ip_address,
            notification_device_id,
            operating_system,
            referral_code
        } = req.body;

        const data = await userService.userSignin({
            username,
            password,
            device_uuid,
            firebase_token,
            ip_address,
            notification_device_id,
            operating_system,
            referral_code
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/loginWithSocialAccount', async (req, res, next) => {

        const {
            google_login_id,
            apple_login_id,
            facebook_login_id,
            linkdin_login_id,
            is_tc_verify,
            user_signup_with,
            first_name,
            last_name,
            email,
            country_code,
            mobile_no,
            device_uuid,
            firebase_token,
            notification_device_id,
            ip_address,
            device_type,
            operating_system,
            referral_code
        } = req.body;
        const data = await userService.loginWithSocialAccount({
            google_login_id,
            apple_login_id,
            facebook_login_id,
            linkdin_login_id,
            is_tc_verify,
            user_signup_with,
            first_name,
            last_name,
            email,
            country_code,
            mobile_no,
            device_uuid,
            firebase_token,
            notification_device_id,
            ip_address,
            device_type,
            operating_system,
            referral_code
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/getLinkedinData', await validateFormFields([
        body('token')
        .notEmpty()
        .withMessage('Token is required'),

        body('redirect_uri')
        .notEmpty()
        .withMessage('Redirect uri is required'),
    ]), async (req, res, next) => {
        const {
            token,
            redirect_uri
        } = req.body;
        const data = await userService.getLinkedinData({
            token,
            redirect_uri
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/signup',
        await validateFormFields([
            body('first_name')
            .notEmpty()
            .withMessage('First name is required')
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid first name'),

            body('last_name')
            .notEmpty()
            .withMessage('Last name is required')
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid last name'),

            body('email')
            .notEmpty()
            .withMessage('Email id is required')
            .matches(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i)
            .withMessage('Please enter valid email id'),

            body('mobile_no')
            .notEmpty()
            .withMessage('Mobile no is required')
            .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
            .withMessage('Please enter valid mobile no'),

            body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1
            })
            .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),

            body('operating_system')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('OS must be alphabetic only')
        ]), async (req, res, next) => {

            const {
                first_name,
                last_name,
                email,
                country_code,
                mobile_no,
                password,
                google_login_id,
                facebook_login_id,
                user_signup_with,
                linkdin_login_id,
                is_tc_verify,
                device_uuid,
                firebase_token,
                notification_device_id,
                ip_address,
                device_type,
                operating_system,
                referral_code
            } = req.body;

            const data = await userService.addUser({
                first_name,
                last_name,
                email,
                country_code,
                mobile_no,
                password,
                google_login_id,
                facebook_login_id,
                user_signup_with,
                linkdin_login_id,
                is_tc_verify,
                device_uuid,
                firebase_token,
                notification_device_id,
                ip_address,
                device_type,
                operating_system,
                referral_code
            });
            res.status(data.status_code).json(data);
    });

    app.post('/user/addStudents', UserAuth, uploadFile.single('profile_image'),
        await validateFormFields([
            body('first_name')
            .notEmpty()
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid first name'),

            body('last_name')
            .notEmpty()
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid first name'),

            body('email')
            .notEmpty()
            .matches(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i)
            .withMessage('Please enter valid email id'),

            body('mobile_no')
            .notEmpty()
            .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
            .withMessage('Please enter valid mobile no'),

            body('password')
            .notEmpty()
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1
            })
            .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),

            // body('gender')
            // .matches(/^[A-Za-z\s]+$/)
            // .withMessage('Gender must be alphabetic only')
        ]), async (req, res, next) => {

            let profileImage = req?.file ? (process.env.STORAGE_TYPE == "S3") ? `${process.env.STORAGE_TYPE}/${req?.file?.key}` : `${process.env.STORAGE_TYPE}/${req?.file?.filename}` : null;
            
            const {
                first_name,
                last_name,
                email,
                country_code,
                mobile_no,
                birth_date,
                gender,
                password,
                user_signup_with,
                note,
                notification_device_id
            } = req.body;
            const data = await userService.addStudent({
                first_name,
                last_name,
                email,
                country_code,
                mobile_no,
                birth_date,
                gender,
                password,
                user_signup_with,
                note,
                profile_image: profileImage,
                notification_device_id
            });
            res.status(data.status_code).json(data);
        });

    app.post('/user/addInstituteStudent',
        await validateFormFields([
            body('first_name')
            .notEmpty()
            .withMessage('First name is required')
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid first name'),

            body('last_name')
            .notEmpty()
            .withMessage('Last name is required')
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid last name'),

            body('email')
            .notEmpty()
            .withMessage('Email is required')
            .matches(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i)
            .withMessage('Please enter valid email id'),

            body('mobile_no')
            .notEmpty()
            .withMessage('Mobile no is required')
            .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
            .withMessage('Please enter valid mobile no'),

            body('password')
            .notEmpty()
            .withMessage('Password is required')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)
            .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),

            // body('gender')
            // .matches(/^[A-Za-z\s]+$/)
            // .withMessage('Gender must be alphabetic only')
        ]), async (req, res, next) => {

            const {
                first_name,
                last_name,
                email,
                country_code,
                mobile_no,
                birth_date,
                gender,
                password,
                user_signup_with,
                note,
                institute_id,
                profile_image,
                notification_device_id
            } = req.body;
            const data = await userService.addStudent({
                first_name,
                last_name,
                email,
                country_code,
                mobile_no,
                birth_date,
                gender,
                password,
                user_signup_with,
                note,
                institute_id,
                profile_image,
                notification_device_id
            });

            res.json(data);
        });

    app.post('/user/getStudentList', UserAuth, await validateFormFields([
        body('startToken')
        .isNumeric()
        .withMessage('Enter a valid start token value'),

        body('endToken')
        .notEmpty()
        .withMessage('End token is required')
        .isNumeric()
        .withMessage('Enter a valid end token value'),

        body('institution_id')
        .optional()
        .isMongoId()
        .withMessage('Institution id is not valid')
    ]), async (req, res, next) => {

        const {
            search,
            startToken,
            endToken,
            institution_id,
            referral_code
        } = req.body;

        const data = await userService.getStudentsData({
            search,
            startToken,
            endToken,
            institution_id,
            referral_code
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/getStudentCount', UserAuth, async (req, res, next) => {

        const data = await userService.getStudentsCount();

        res.status(data.status_code).json(data);
    });

    app.post('/user/bulkImport', async (req, res, next) => {
        const {
            institute_id,
            first_name,
            last_name,
            email,
            country_code,
            mobile_no,
            password,
            google_login_id,
            facebook_login_id,
            user_signup_with
        } = req.body;
        const data = await userService.importStudents({
            institute_id,
            first_name,
            last_name,
            email,
            country_code,
            mobile_no,
            password,
            google_login_id,
            facebook_login_id,
            user_signup_with
        });
        res.json(data);
    });

    app.post('/user/sendOtp', await validateFormFields([
        body('mobile_no')
        .notEmpty()
        .withMessage('Mobile no is required')
        .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
        .withMessage('Please enter valid mobile no'),

        body('country_code')
        .isNumeric()
        .withMessage('Country code not valid')
        .notEmpty()
        .withMessage('Country code not valid')
    ]), async (req, res, next) => {

        const {
            mobile_no,
            country_code,
            user_id
        } = req.body;
        const data = await userService.sendOtp({
            mobile_no,
            country_code,
            user_id
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/verifyOtp', await validateFormFields([
        body('user_id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid"),

        body('otp')
        .notEmpty()
        .withMessage('Otp is required')
    ]), async (req, res, next) => {
        const {
            user_id,
            otp
        } = req.body;

        const data = await userService.verifyOtp({
            user_id,
            otp
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/sendForgotPasswordLink', await validateFormFields([
        body('email')
        .notEmpty()
        .withMessage('Email id is required')
        .matches(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i)
        .withMessage('Please enter valid email id')
    ]), async (req, res, next) => {
        const {
            email
        } = req.body;
        const data = await userService.sendForgotPasswordLink({
            email
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/changePassword', await validateFormFields([
        body('email_id')
        .notEmpty()
        .withMessage('Email id is required')
        .matches(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i)
        .withMessage('Please enter valid email id'),

        body('new_password')
        .notEmpty()
        .withMessage('New password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        })
        .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),

        body('confirm_password')
        .notEmpty()
        .withMessage('Confirm password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        })
        .withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
    ]), async (req, res, next) => {

        const {
            email_id,
            new_password,
            confirm_password
        } = req.body;
        const data = await userService.changePassword({
            email_id,
            new_password,
            confirm_password
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/getAccountData', UserAuth, await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {
        const {
            id
        } = req.body;
        const data = await userService.getStudentAccountDetail({
            id
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/updateAccountData', UserAuth,
        await validateFormFields([
            body('first_name')
            .notEmpty()
            .withMessage('First name is required')
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid first name'),

            body('last_name')
            .notEmpty()
            .withMessage('Last name is required')
            .matches(/^[a-zA-Z0-9\s\-_.]*$/)
            .withMessage('Enter a valid last name'),

            body('email')
            .notEmpty()
            .withMessage('Email id is required')
            .matches(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i)
            .withMessage('Please enter valid email id'),

            body('mobile_no')
            .optional({ checkFalsy: true }) // Allow empty or falsy input
            .custom((value, { req }) => {
                if (!value) {
                    return true; // Skip validation if the field is empty or falsy
                }

                if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
                    throw new Error('Please enter a valid mobile no');
                }
                return true;
            }),

            body('id')
            .notEmpty()
            .withMessage('User id is required')
            .isMongoId().withMessage("Id is not valid"),

            // body('gender')
            // .optional()
            // .matches(/^[A-Za-z\s]+$/)
            // .withMessage('Gender must be alphabetic only')
        ]), async (req, res, next) => {

            const {
                id,
                first_name,
                last_name,
                email,
                country_code,
                mobile_no,
                birth_date,
                gender
            } = req.body;
            const data = await userService.updateAccountData({
                id,
                first_name,
                last_name,
                email,
                country_code,
                mobile_no,
                birth_date,
                gender
            });

            res.status(data.status_code).json(data);
        });

    app.post('/user/changeAccountPassword', UserAuth, await validateFormFields([
        body('old_password')
        .notEmpty()
        .withMessage('Old password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        }).withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),


        body('new_password')
        .notEmpty()
        .withMessage('New password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        }).withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),

        body('confirm_password')
        .notEmpty()
        .withMessage('Confirm password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        }).withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),

        body('id')
        .notEmpty()
        .withMessage('User id is required')
    ]), async (req, res, next) => {

        const {
            id,
            old_password,
            new_password,
            confirm_password
        } = req.body;
        const data = await userService.changeAccountPassword({
            id,
            old_password,
            new_password,
            confirm_password
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/changeNotificationStatus', UserAuth, await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {

        const {
            id,
            status
        } = req.body;
        const data = await userService.changeNotificationStatus({
            id,
            status
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/changeApplicationLanguage', UserAuth, await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {

        const {
            id,
            language
        } = req.body;
        const data = await userService.changeApplicationLanguage({
            id,
            language
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/changeStudentPassword', UserAuth, await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid"),

        body('new_password')
        .notEmpty()
        .withMessage('New password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        }).withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),

        body('confirm_password')
        .notEmpty()
        .withMessage('Confirm password is required')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        }).withMessage("Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
    ]), async (req, res, next) => {

        const {
            id,
            new_password,
            confirm_password
        } = req.body;
        const data = await userService.changeStudentPassword({
            id,
            new_password,
            confirm_password
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/getStudentById', UserAuth, await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {

        const {
            id
        } = req.body;

        const data = await userService.getStudentAccountDetail({
            id
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/updateStudentData', UserAuth, uploadFile.single('profile_image'), await validateFormFields([
        body('first_name')
        .notEmpty()
        .matches(/^[a-zA-Z0-9\s\-_.]*$/)
        .withMessage('Enter a valid first name'),

        body('last_name')
        .notEmpty()
        .matches(/^[a-zA-Z0-9\s\-_.]*$/)
        .withMessage('Enter a valid first name'),

        body('email')
        .notEmpty()
        .matches(/^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i)
        .withMessage('Please enter valid email id'),

        body('mobile_no')
        .notEmpty()
        .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
        .withMessage('Please enter valid mobile no'),

        // body('gender')
        // .matches(/^[A-Za-z\s]+$/)
        // .withMessage('Gender must be alphabetic only'),

        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {
        let profileImage = req?.file ? (process.env.STORAGE_TYPE == "S3") ? `${process.env.STORAGE_TYPE}/${req?.file?.key}` : `${process.env.STORAGE_TYPE}/${req?.file?.filename}` : null;

        const {
            id,
            first_name,
            last_name,
            email,
            country_code,
            mobile_no,
            birth_date,
            gender,
            note
        } = req.body;
        const data = await userService.updateStudentData({
            id,
            first_name,
            last_name,
            email,
            country_code,
            mobile_no,
            birth_date,
            gender,
            note,
            profile_image: profileImage
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/deleteStudent', UserAuth, await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {

        const {
            id
        } = req.body;

        const data = await userService.deleteStudent({
            id
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/updateProfileImage', UserAuth, uploadFile.single('profile_image'), await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {

        let profileImage = req?.file ? (process.env.STORAGE_TYPE == "S3") ? `${process.env.STORAGE_TYPE}/${req?.file?.key}` : `${process.env.STORAGE_TYPE}/${req?.file?.filename}` : null;

        const {
            id
        } = req.body;
        const data = await userService.changeProfileImage({
            id,
            profile_image: profileImage
        });
        res.status(data.status_code).json(data);
    });

    app.post('/user/checkUserEmail', async (req, res, next) => {

        const {
            email_id
        } = req.body;
        const data = await userService.checkUserData({
            email_id
        });

        res.json(data);
    });

    app.post('/user/checkUserMobile', await validateFormFields([
        body('mobile_no')
        .notEmpty()
        .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
        .withMessage('Please enter valid mobile no')
    ]), async (req, res, next) => {

        const {
            mobile_no
        } = req.body;
        const data = await userService.checkUserData({
            mobile_no
        });

        res.json(data);
    });

    app.get('/user/getLanguageData', UserAuth, async (req, res, next) => {

        const data = await userService.getLanguageData();

        res.json(data);
    });

    app.get('/user/getUserLocation', UserAuth, async (req, res, next) => {

        var ip = req.headers.ip;


        let locationData = await GetUserLocation(ip);


        res.json(locationData);
    });

    app.get('/user/getEnrollmentData', UserAuth, async (req, res, next) => {

        const data = await userService.getEnrollmentData();

        res.json(data);
    });

    app.post('/user/getMobileUsageData', UserAuth, await validateFormFields([
        body('filter_value')
        .notEmpty()
        .withMessage('Filter parameter is required')
    ]), async (req, res, next) => {

        const {
            filter_value
        } = req.body;

        let data = null
        if (filter_value == "week") {
            data = await userService.getMobileUsageInWeekData();
        } else if (filter_value == "days") {
            data = await userService.getMobileUsageInDaysData();
        } else if (filter_value == "month") {
            data = await userService.getMobileUsageInMonthData();
        }

        res.send(data);
    });

    app.post('/user/getLoginHistoryData', UserAuth, await validateFormFields([
        body('filter_value')
        .notEmpty()
        .withMessage('Filter parameter is required')
    ]), async (req, res, next) => {

        const {
            filter_value
        } = req.body;
        let data = null
        if (filter_value == "week") {
            data = await userService.getLoginHistoryInWeekData();
        } else if (filter_value == "days") {
            data = await userService.getLoginHistoryInDaysData();
        } else if (filter_value == "month") {
            data = await userService.getLoginHistoryInMonthData();
        }

        res.send(data);
    });

    app.post('/user/getRegistrationHistoryData', UserAuth, await validateFormFields([
        body('filter_value')
        .notEmpty()
        .withMessage('Filter parameter is required')
    ]), async (req, res, next) => {

        const {
            filter_value
        } = req.body;


        let data = null
        if (filter_value == "week") {
            data = await userService.getRegistrationHistoryInWeekData();
        } else if (filter_value == "days") {
            data = await userService.getRegistrationHistoryInDaysData();
        } else if (filter_value == "month") {
            data = await userService.getRegistrationHistoryInMonthData();
        }

        res.send(data);
    });

    app.get('/user/getCourseEnrollmentByCourse', async (req, res, next) => {

        const data = await userService.getCourseEnrollmentDataCourseWise(req);

        res.json(data);
    });

    app.get('/user/getCourseCompletionRateData', async (req, res, next) => {

        const data = await userService.getCourseCompletionRateCourseWise(req);

        res.json(data);
    });

    app.post('/user/getRegistrationRateData', UserAuth, await validateFormFields([
        body('filter_value')
        .notEmpty()
        .withMessage('Filter parameter is required')
    ]), async (req, res, next) => {

        const {
            filter_value
        } = req.body;


        let data = null
        if (filter_value == "week") {
            data = await userService.getRegistrationRateInWeekData();
        } else if (filter_value == "days") {
            data = await userService.getRegistrationRateInDaysData();
        } else if (filter_value == "month") {
            data = await userService.getRegistrationRateInMonthData();
        }

        res.send(data);
    });

    app.post('/user/getEnrollmentRateData', UserAuth, await validateFormFields([
        body('filter_value')
        .notEmpty()
        .withMessage('Filter parameter is required')
    ]), async (req, res, next) => {

        const {
            filter_value
        } = req.body;

        let data = null
        if (filter_value == "week") {
            data = await userService.getCourseEnrollmentRateInWeekData();
        } else if (filter_value == "days") {
            data = await userService.getCourseEnrollmentRateInDaysData();
        } else if (filter_value == "month") {
            data = await userService.getCourseEnrollmentRateInMonthData();
        }

        res.send(data);
    });

    app.get('/user/getLoginFrequencyData', UserAuth, async (req, res, next) => {

        const data = await userService.getLoginFrequencyData();

        res.json(data);
    });

    app.get('/user/getCourseEnrollmentPercentageData', UserAuth, async (req, res, next) => {

        let data = await userService.getCourseEnrollmentPercentageInWeekData();

        res.send(data);
    });

    app.get('/user/getCourseCompletionRateBycourse', UserAuth, async (req, res, next) => {

        let data = await userService.getCourseCompletionRateData();

        res.send(data);
    });

    app.post('/user/getallstudent', UserAuth, async (req, res, next) => {

        const data = await userService.getAllStudent();

        res.json(data);
    });

    app.post('/user/resetProfileImage', UserAuth, await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {

        const {
            id
        } = req.body;

        const data = await userService.resetProfileImage({
            id
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/studentById', await validateFormFields([
        body('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId().withMessage("Id is not valid")
    ]), async (req, res, next) => {

        const {
            id
        } = req.body;

        const data = await userService.getStudentAccountDetail({
            id
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/checkMobileNo', UserAuth, await validateFormFields([
        body('mobile_no')
        .notEmpty()
        .withMessage('Mobile no is required')
        .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
        .withMessage('Please enter valid mobile no'),

        body('country_code')
        .isNumeric()
        .withMessage('Country code not valid')
        .notEmpty()
        .withMessage('Country code not valid'),
    ]), async (req, res, next) => {
        const {
            mobile_no,
            country_code
        } = req.body;
        let user_id = req.user !== undefined ? req.user.user_id : null;

        const data = await userService.checkMobileNo({
            mobile_no,
            country_code,
            user_id
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/verifyMobileOtp', UserAuth, await validateFormFields([
        body('otp')
        .notEmpty()
        .withMessage('Otp is required'),

        body('mobile_no')
        .notEmpty()
        .withMessage('Mobile no is required')
        .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)
        .withMessage('Please enter valid mobile no'),

        body('country_code')
        .isNumeric()
        .withMessage('Country code not valid')
        .notEmpty()
        .withMessage('Country code not valid'),
    ]), async (req, res, next) => {
        const {
            otp,
            mobile_no,
            country_code
        } = req.body;

        let user_id = req.user !== undefined ? req.user.user_id : null;
        const data = await userService.verifyMobileOtp({
            user_id,
            otp,
            mobile_no,
            country_code
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/getUserAgeData', UserAuth, async (req, res, next) => {

        const {
            start_date,
            end_date
        } = req.body;

        const data = await userService.getAgeData({
            start_date,
            end_date
        });

        res.json(data);
    });

    app.post('/user/getGenderData', UserAuth, async (req, res, next) => {

        const {
            start_date,
            end_date
        } = req.body;

        const data = await userService.getGenderData({
            start_date,
            end_date
        });

        res.json(data);
    });

    app.post('/user/stateWiseLocationDistribution', UserAuth, async (req, res, next) => {

        const {
            start_date,
            end_date
        } = req.body;

        const data = await userService.getStateWiseLocationDistributionData({
            start_date,
            end_date
        });

        res.json(data);
    });

    app.post('/user/cityWiseLocationDistribution', UserAuth, async (req, res, next) => {
        const {
            start_date,
            end_date
        } = req.body;

        const data = await userService.getCityWiseLocationDistributionData({
            start_date,
            end_date
        });

        res.json(data);
    });

    app.post('/user/signupDistribution', UserAuth, async (req, res, next) => {
        const {
            start_date,
            end_date
        } = req.body;

        const data = await userService.getSignupDistribution({
            start_date,
            end_date
        });

        res.json(data);
    });

    app.post('/user/osUsage', UserAuth, async (req, res, next) => {
        const {
            start_date,
            end_date
        } = req.body;

        const data = await userService.getOSUsage({
            start_date,
            end_date
        });

        res.json(data);
    });

    app.post('/user/userBase', UserAuth, async (req, res, next) => {
        const {
            start_date,
            end_date
        } = req.body;

        const data = await userService.userBase({
            start_date,
            end_date
        });

        res.json(data);
    });

    app.post('/user/userEngagement', UserAuth, async (req, res, next) => {
        const {
            start_date,
            end_date
        } = req.body;

        const data = await userService.userEngagement({
            start_date,
            end_date
        });

        res.json(data);
    });

    app.post('/user/getallstudentList', async (req, res, next) => {

        const data = await userService.getAllStudent();

        res.json(data);
    });

    app.post('/user/getStudent', async (req, res, next) => {
        const {
            id
        } = req.body;
        const data = await userService.getStudentAccountDetail({
            id
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/storeEmailLogs', async (req, res, next) => {
        const {
            user_id,
            message_id,
            from,
            to,
            subject,
            module,
            response
        } = req.body;

        const data = await userService.saveEmailLogs({
            user_id,
            message_id,
            from,
            to,
            subject,
            module,
            response
        });

        res.status(data.status_code).json(data);
    });

    app.post('/user/getStudentsByIds', async (req, res, next) => {
        const {
            students
        } = req.body;
        const data = await userService.getStudentsByIds(students);

        res.status(data.status_code).json(data);
    });

    app.get('/user/testNotification', async (req, res, next) => {
        await userService.testNotification();
        res.status(200).json({
            message:"testing "
        });
    });
}
