const { UserModel, UserMobileActivityModel, UserCourseModel, CourseWatchHistoryModel, EmailLogsModel, InvoiceModel } = require("../database");
const { GeneratePassword, GenerateSalt , CheckPassword, ValidateEmail, ValidateMobileNumber, ValidatePassword, GenerateSignature, sendSingleSms, GetUserLocation, sendPushNotification, millisecToTime } = require('../utils');
const constants = require('../utils/constant');
const moment = require('moment');
const axios = require('axios');
const { RandomNumber, DateToTimestamp, sendMail,findUserReferralCode } = require('../utils');
const { CallAdminEvent, CallCourseQueryEvent } = require('../utils/call-event-bus');
const { welcomeTemplate, forgotPasswordTemplate, welcomeWithCredetialsTemplate, dailySnapshot, weeklySnapshot, monthlySnapshot } = require('../utils/email-template');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { deleteFile } = require('../utils/aws');

const maxLoginAttempts = 5;
const windowMs = 250;
const limiter = new RateLimiterMemory({ points: maxLoginAttempts, duration: windowMs, blockDuration: windowMs });

//login with social media account (google / facebook / linkdin)
const getLinkedinData = async (userInputs) => {
    try {
        const { token, redirect_uri } = userInputs;

        let accessToken = await axios.post('https://www.linkedin.com/oauth/v2/accessToken',
          {
            grant_type: 'authorization_code',
            code: token,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            redirect_uri: redirect_uri
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(res => {
          if(res?.data?.access_token){
            return res?.data?.access_token
          }else{
            return false
          }
        }).catch((err) => {
            return false
        });

        if(accessToken){
            let emaildata = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
            {
                headers: {
                  'Authorization': 'Bearer ' + accessToken,
                }
            }).then(res => {
                return res.data;
            })

            let userdata = await axios.get('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
            {
                headers: {
                  'Authorization': 'Bearer ' + accessToken,
                }
            }).then(res => {
                return res.data;
            })

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                email_data: emaildata,
                user_data: userdata
            };
        }else{
            return {
                status: false,
                status_code: constants.EXCEPTION_ERROR_CODE,
                message: "Sorry! Failed get linkedin data.",
                data: ''
            };
        }
        
        
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in loginWithSocialAccount:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! Failed get linkedin data.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}


//login with social media account (google / facebook / linkdin)
const loginWithSocialAccount = async (userInputs) => {
    try {
        const { google_login_id, facebook_login_id,apple_login_id, linkdin_login_id, is_tc_verify , user_signup_with, first_name, last_name, email, country_code, mobile_no, device_uuid, firebase_token, notification_device_id, ip_address, device_type, operating_system, referral_code, user_referral_code } = userInputs;
        
        //check duplicate login data
        const getEmailData = email ? await UserModel.fatchUserfilterData({ email: email }) : null;
        const checkMobileDuplication = mobile_no ? await UserModel.fatchUserfilterData({ mobile_no: mobile_no }) : null;
        let getUserData = await UserModel.fatchUserData(null,google_login_id, facebook_login_id, linkdin_login_id, apple_login_id);


        if(checkMobileDuplication || getEmailData || getUserData){
         
            if(getUserData){
                getUserData = getUserData
            }else if(getEmailData){
                getUserData = getEmailData

                let updateData = { 
                    google_login_id: google_login_id,
                    facebook_login_id: facebook_login_id,
                    linkdin_login_id: linkdin_login_id,
                    apple_login_id: apple_login_id,
                    last_login_time: new Date(),
                }
                
                if(device_uuid  && firebase_token){
                    updateData['device_uuid'] = device_uuid
                    updateData['firebase_token'] = firebase_token
                }

                if(notification_device_id){
                    updateData['notification_device_id'] = notification_device_id;
                }
                UserModel.updateUser(getUserData._id,updateData);
            }else if(checkMobileDuplication){
                getUserData = checkMobileDuplication

                let updateData = { 
                    google_login_id: google_login_id,
                    facebook_login_id: facebook_login_id,
                    linkdin_login_id: linkdin_login_id,
                    last_login_time: new Date()
                }
                
                if(device_uuid && firebase_token){
                    updateData['device_uuid'] = device_uuid
                    updateData['firebase_token'] = firebase_token
                }

                if(notification_device_id){
                    updateUserData['notification_device_id'] = notification_device_id;
                }
                UserModel.updateUser(getUserData._id,updateData);
            }
        
            let jwtData = {
                user_id: getUserData._id,
                first_name : getUserData.first_name,
                last_name : getUserData.last_name,
                user_type: getUserData.user_type,
                user_login_type: user_signup_with,
            }

            const getFilterData = await UserCourseModel.filterUserCourseData({ user_id: getUserData._id });

            let isPurchase = false
            if(getFilterData?.type){
                if(getFilterData.type == 1){
                    isPurchase = true
                }else{
                    if(getFilterData.type == 2 && getFilterData.payment_status == 2 && getFilterData.is_cancle_subscription == false){
                        isPurchase = true
                    }
                }
            }

            let sendData = {
                user_id: getUserData._id,
                first_name : getUserData.first_name,
                last_name : getUserData.last_name,
                email : getUserData.email,
                country_code : getUserData.country_code,
                mobile_no : getUserData.mobile_no,
                user_type: getUserData.user_type,
                user_login_type: getUserData.user_signup_with,
                last_login_type: user_signup_with,
                profile_image : getUserData?.profile_image || null,
                is_purchase: isPurchase
            }

            let jwtToken = await GenerateSignature(jwtData);

            //update last login time
            const updateUserData = { 
                last_login_type: user_signup_with,
                operating_system: operating_system
            };
            if(notification_device_id){
                updateUserData['notification_device_id'] = notification_device_id;
            }

            if(referral_code || user_referral_code){
                const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: getUserData._id });
                if(getUserCourseData?.length == 0){
                    if(referral_code){
                        updateUserData['referral_code'] = referral_code
                        updateUserData['referral_type'] = 1
                    }else if(user_referral_code){
                        updateUserData['users_referral_code'] = user_referral_code
                        updateUserData['referral_type'] = 2
                    }
                }
            }
            
            UserModel.updateUser(getUserData._id,updateUserData);

            await UserMobileActivityModel.createUserLoginHistory({ 
                user_id: getUserData._id,
                device_uuid: device_uuid,
                firebase_token: firebase_token,
                login_time: new Date()
            });

        
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Login successfully",
                data: sendData,
                token: jwtToken
            };

        }else{
            let salt = await GenerateSalt();
            let studentData ={ 
                password_salt: salt,
                user_signup_with: user_signup_with,
                google_login_id: google_login_id,
                apple_login_id: apple_login_id,
                facebook_login_id: facebook_login_id,
                linkdin_login_id: linkdin_login_id,
                is_deleted: false,
                status: 1,
                user_type: 5,
                is_tc_verify: is_tc_verify,
                email: email,
                mobile_no:  mobile_no,
                country_code: country_code,
                first_name : first_name,
                last_name : last_name,
                device_uuid: device_uuid,
                firebase_token: firebase_token,
                last_login_time: new Date(),
                is_verify_otp: true,
                device_type: device_type,
                operating_system: operating_system,
                user_referral_code: await findUserReferralCode()
            }
            if(notification_device_id){
                studentData['notification_device_id'] = notification_device_id;
            }
            if(ip_address){
                let locationData = await GetUserLocation(ip_address);

                studentData['country'] = locationData?.country_name || null
                studentData['state'] = locationData?.region_name || null
                studentData['city'] = locationData?.city || null
                studentData['pincode'] = locationData?.zip_code || null
                studentData['latitude'] = locationData?.latitude || null
                studentData['longitude'] = locationData?.longitude || null
            }

            if(referral_code || user_referral_code){
                if(referral_code){
                    studentData['referral_type'] = 1
                    studentData['referral_code'] = referral_code
                }else if(user_referral_code){
                    studentData['referral_type'] = 2
                    studentData['users_referral_code'] = user_referral_code
                }
            }

            const createStudent = await UserModel.createUser(studentData); 

            if(createStudent){

                let jwtData = {
                    user_id: createStudent._id,
                    user_type: 5,
                    user_login_type: user_signup_with,
                    first_name : first_name,
                    last_name : last_name,
                }

                let sendData = {
                    user_id: createStudent._id,
                    user_type: 5,
                    user_login_type: user_signup_with,
                    first_name : first_name,
                    last_name : last_name,
                    email : email,
                    country_code : country_code,
                    mobile_no : mobile_no,
                    last_login_type: user_signup_with,
                    profile_image : null,
                    is_purchase: false
                }

                let jwtToken = await GenerateSignature(jwtData);

                await UserMobileActivityModel.createUserLoginHistory({ 
                    user_id: createStudent._id,
                    device_uuid: device_uuid,
                    firebase_token: firebase_token,
                    login_time: new Date()
                });

                if(email){
                    let subject = "Welcome to Virtual Vidhyapith LMS - Unlock Your Learning Potential!!";
                    let message = await welcomeTemplate({ user_name: `${first_name} ${last_name}`, subject: subject});
                    sendMail(email, message, subject, createStudent._id, "Add User");
                }

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "User has been created successfully.",
                    data: sendData,
                    token: jwtToken
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Sorry! User signup failed.",
                };
            }   
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in loginWithSocialAccount:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! User signup failed.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

//signin
const userSignin = async (userInputs) => {
    try{
        const { username, password, device_uuid, firebase_token, ip_address, notification_device_id, operating_system, referral_code, user_referral_code } = userInputs;
        
        /* const rateLimiterRes = await limiter.consume(ip_address).then((data) => {
            return data;
        }).catch((error) => {

            const newBlockLifetimeSecs = 15 * 60
            limiter.block(ip_address, newBlockLifetimeSecs);
            // console.log('error :: ',error);
            return error;
        });
        if (rateLimiterRes.remainingPoints <= 0) {
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Security Alert: Too Many Login Attempts, Please Try Again After Some Time.",
                data: null,
                token: null
            };
        } */

        //check user name is this institute or student
        const getUserData = await UserModel.fatchUserData(username);
        const getInstituteEmailData = await CallAdminEvent("check_institute_email_id",{ email_id: username  }, "");

        if(getUserData && getUserData.is_deleted !== true){
            if(!getUserData.is_verify_otp){
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Your mobile no is not verified yet. Please signup first and verify it.",
                    is_send_otp: true,
                    data: {
                        country_code : getUserData.country_code,
                        mobile_no : getUserData.mobile_no
                    },
                    token: null
                };
            }

            if(getUserData.status == 1){
                let validPassword = await ValidatePassword(password, getUserData.password, getUserData.password_salt);

                if(validPassword){
                    //update last login time
                    const updateUserData = { 
                        last_login_type: 1,
                        device_uuid: device_uuid,
                        firebase_token: firebase_token,
                        last_login_time: new Date(),
                        operating_system: operating_system
                    };
                    if(notification_device_id){
                        updateUserData['notification_device_id'] = notification_device_id;
                    }
                    if(referral_code || user_referral_code){
                        const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: getUserData._id });
                        if(getUserCourseData?.length == 0){
                            if(referral_code){
                                updateUserData['referral_code'] = referral_code
                                updateUserData['referral_type'] = 1
                            }else if(user_referral_code){
                                updateUserData['users_referral_code'] = user_referral_code
                                updateUserData['referral_type'] = 2
                            }
                        }
                    }
                    
                    UserModel.updateUser(getUserData._id,updateUserData);

                    let jwtData = {
                        user_id: getUserData.id,
                        first_name : getUserData.first_name,
                        last_name : getUserData.last_name,
                        email : getUserData.email,
                        country_code : getUserData.country_code,
                        mobile_no : getUserData.mobile_no,
                        user_type: getUserData.user_type,
                        notification_device_id: notification_device_id
                    }

                     //get course data
                    const getFilterData = await UserCourseModel.filterUserCourseData({ user_id: getUserData.id });

                    let isPurchase = false
                    if(getFilterData?.type){
                        if(getFilterData.type == 1){
                            isPurchase = true
                        }else{
                            if(getFilterData.type == 2 && getFilterData.payment_status == 2 && getFilterData.is_cancle_subscription == false){
                                isPurchase = true
                            }
                        }
                    }

                    let sendData = {
                        user_id: getUserData.id,
                        first_name : getUserData.first_name,
                        last_name : getUserData.last_name,
                        profile_image : getUserData?.profile_image || null,
                        email : getUserData.email,
                        country_code : getUserData.country_code,
                        mobile_no : getUserData.mobile_no,
                        user_type: getUserData.user_type,
                        user_login_type: getUserData.user_signup_with,
                        last_login_type: 1,
                        is_purchase: isPurchase
                    }

                    let jwtToken = await GenerateSignature(jwtData);

                    //user login history
                    await UserMobileActivityModel.createUserLoginHistory({ 
                        user_id: getUserData.id,
                        device_uuid: device_uuid,
                        firebase_token: firebase_token,
                        login_time: new Date(),
                        operating_system: operating_system
                    });

                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: "Login successfully",
                        data: sendData,
                        token: jwtToken
                    };
                }else{
                    return {
                        status: false,
                        status_code: constants.ERROR_RESPONSE,
                        message: "Incorrect login credentials, Please retry.",
                        data: null,
                        token: null
                    };
                }
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Access Denied, Please Try Again.",
                    data: null,
                    token: null
                };
            }
        }
        else if(getInstituteEmailData && getInstituteEmailData.is_deleted !== true){

            if(getInstituteEmailData.is_active && !getInstituteEmailData.is_deleted ){

                let validPassword = await ValidatePassword(password, getInstituteEmailData.password, getInstituteEmailData.password_salt);

                if(validPassword){
                    
                    let jwtData = {
                        user_id: getInstituteEmailData._id,
                        institute_name : getInstituteEmailData.institute_name,
                        email : getInstituteEmailData.email_id,
                        country_code : getInstituteEmailData.country_code,
                        mobile_no : getInstituteEmailData.mobile_no,
                        user_type: 6
                    }

                    let sendData = {
                        user_id: getInstituteEmailData._id,
                        institute_name : getInstituteEmailData.institute_name,
                        email : getInstituteEmailData.email_id,
                        country_code : getInstituteEmailData.country_code,
                        mobile_no : getInstituteEmailData.mobile_no,
                        profile_image : getInstituteEmailData?.logo || null,
                        user_type: 6
                    }

                    let jwtToken = await GenerateSignature(jwtData);

                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: "Login successfully",
                        data: sendData,
                        token: jwtToken
                    };
                }else{
                    return {
                        status: false,
                        status_code: constants.ERROR_RESPONSE,
                        message: "Incorrect login credentials, Please retry.",
                        data: null,
                        token: null
                    };
                }
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Access Denied, Please Try Again.",
                    data: null,
                    token: null
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Incorrect login credentials, Please retry.",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in userSignin:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! User signin failed.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }  
}

//add user data
const quickSignup = async (userInputs) => {
    try{
        const { email, ip_address, device_type, operating_system, referral_code, user_referral_code } = userInputs;

        let errorArray = []

        let isValidData = true;
        let studentId =  null;

        // check email id is valid or not
        const getEmailData = await UserModel.fatchUserfilterData({ email: email });
        const getInstituteEmailData = await CallAdminEvent("check_institute_email_id",{ email_id: email  }, "");

        if(getInstituteEmailData){
            return {
                status: false,
                status_code: constants.CONFLICT_RESPONSE,
                message: "Sorry! User signup failed. Email id is used by another user.",
                id: null,
                error: errorArray
            };
        }

        if(getEmailData){
            studentId = getEmailData.id
        }
        
        if(isValidData){
            let studentData = { 
                email: email,
                is_deleted: false,
                status: 1,
                user_type: 5,
                user_signup_with: 8,
                is_tc_verify: true,
                last_login_type: 1,
                last_login_time: new Date(),
                device_type: device_type,
                operating_system: operating_system 
            }

            if(ip_address){
                let locationData = await GetUserLocation(ip_address);

                studentData['country'] = locationData?.country_name || null
                studentData['state'] = locationData?.region_name || null
                studentData['city'] = locationData?.city || null
                studentData['pincode'] = locationData?.zip_code || null
                studentData['latitude'] = locationData?.latitude || null
                studentData['longitude'] = locationData?.longitude || null
            }

            if((referral_code || user_referral_code) && studentId) {
                const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: studentId });
                if(getUserCourseData?.length == 0){
                    if(referral_code){
                        studentData['referral_code'] = referral_code
                        studentData['referral_type'] = 1
                    }else if(user_referral_code){
                        studentData['users_referral_code'] = user_referral_code
                        studentData['referral_type'] = 2
                    }
                }
            }else if (referral_code || user_referral_code) {
                if(referral_code){
                    studentData['referral_code'] = referral_code
                    studentData['referral_type'] = 1
                }else if(user_referral_code){
                    studentData['users_referral_code'] = user_referral_code
                    studentData['referral_type'] = 2
                }
            }

            let createStudent = null
            if(studentId){
                createStudent = await UserModel.updateUser(studentId,studentData);
            }else{
                
                studentData['user_referral_code'] = await findUserReferralCode()

                createStudent = await UserModel.createUser(studentData);
                studentId = createStudent._id
            }
            
            if(createStudent){

                let jwtData = {
                    user_id: studentId,
                    first_name : "",
                    last_name : "",
                    email : email,
                    country_code : 0,
                    mobile_no : "",
                    user_type: 5,
                    notification_device_id: ""
                }

                let sendData = {
                    user_id: studentId,
                    first_name : "",
                    last_name : "",
                    email : email,
                    country_code : "",
                    mobile_no : "",
                    user_type: 5,
                    user_login_type: 1,
                    last_login_type: 1,
                    is_purchase: false
                }

                //user login history
                await UserMobileActivityModel.createUserLoginHistory({ 
                    user_id: studentId,
                    device_uuid: "",
                    firebase_token: "",
                    login_time: new Date()
                });

                let jwtToken = await GenerateSignature(jwtData);
                
                let subject = "Welcome to Virtual Vidhyapith LMS - Unlock Your Learning Potential!!";
                let message = await welcomeTemplate({ user_name: `${first_name} ${last_name}`, subject: subject});
                await sendMail(email, message, subject, studentId, "Add User");

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "User has been created successfully.",
                    data: sendData,
                    token: jwtToken
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Sorry! User signup failed.",
                };
            }   
        }else{
            return {
                status: false,
                status_code: constants.CONFLICT_RESPONSE,
                message: "Sorry! User signup failed.",
                id: null,
                error: errorArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addUser:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! User signup failed.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }  
}

//add user data
const addUser = async (userInputs) => {
    try{
        const { 
            first_name, last_name, email, country_code, mobile_no, birth_date, gender, password, is_tc_verify , note, device_uuid, firebase_token, notification_device_id, ip_address, device_type, operating_system, referral_code, user_referral_code, is_funnel_user
        } = userInputs;

        let errorArray = {
            email: "",
            mobile_no: ""
        }

        let isValidData = true;
        let isOtpNotValidate = false;
        let studentId =  null;

        // check email id is valid or not
        const getEmailData = await UserModel.fatchUserfilterData({ email: email });
        const getInstituteEmailData = await CallAdminEvent("check_institute_email_id",{ email_id: email  }, "");

        if(getEmailData !== null || getInstituteEmailData !== null){
            if(getEmailData){
                isOtpNotValidate = true
                studentId = getEmailData.id
            }else{
                isValidData = false
                errorArray["email"] = "Email id is already exists" 
            }
        }
        // check mobile no is valid or not
        if (mobile_no && !studentId) {
            const checkMobileDuplication = await UserModel.fatchUserfilterData({ mobile_no: mobile_no });
            const getInstituteMobileData = await CallAdminEvent("check_institute_mobile_no",{ mobile_no: mobile_no }, "");
            if(checkMobileDuplication !== null || getInstituteMobileData !== null){
                if(checkMobileDuplication){
                    isOtpNotValidate = true
                    studentId = checkMobileDuplication.id
                }else{
                    isValidData = false
                    errorArray["mobile_no"] = "Mobile number is already exists" 
                }  
            }
        }
        
        if(isValidData){
            let salt = await GenerateSalt();

            let studentData = { 
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile_no:  mobile_no,
                birth_date: birth_date ? moment(new Date(birth_date) , "YYYY-MM-DD") : null,
                gender: gender,
                country_code: country_code,
                password: await GeneratePassword(password, salt),
                password_salt: salt,
                is_deleted: false,
                status: 1,
                user_type: 5,
                user_signup_with: 1,
                note: note,
                is_tc_verify: is_tc_verify,
                last_login_type: 1,
                device_uuid: device_uuid,
                firebase_token: firebase_token,
                last_login_time: new Date(),
                device_type: device_type,
                operating_system: operating_system,
                is_verify_otp: true
            }

            // if(is_funnel_user){
            //     studentData['is_verify_otp'] = true
            // }

            if(ip_address){
                let locationData = await GetUserLocation(ip_address);

                studentData['country'] = locationData?.country_name || null
                studentData['state'] = locationData?.region_name || null
                studentData['city'] = locationData?.city || null
                studentData['pincode'] = locationData?.zip_code || null
                studentData['latitude'] = locationData?.latitude || null
                studentData['longitude'] = locationData?.longitude || null
            }

            if(notification_device_id){
                studentData['notification_device_id'] = notification_device_id;
            }

            if((referral_code || user_referral_code) && studentId) {
                const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: studentId });
                if(getUserCourseData?.length == 0){
                    if(referral_code){
                        studentData['referral_code'] = referral_code
                        studentData['referral_type'] = 1
                    }else if(user_referral_code){
                        studentData['users_referral_code'] = user_referral_code
                        studentData['referral_type'] = 2
                    }
                }
            }else if (referral_code || user_referral_code) {
                if(referral_code){
                    studentData['referral_code'] = referral_code
                    studentData['referral_type'] = 1
                }else if(user_referral_code){
                    studentData['users_referral_code'] = user_referral_code
                    studentData['referral_type'] = 2
                }
            }

            let createStudent = null
            if(isOtpNotValidate && studentId){
                createStudent = await UserModel.updateUser(studentId,studentData);
            }else{
                
                studentData['user_referral_code'] = await findUserReferralCode()

                createStudent = await UserModel.createUser(studentData);
                studentId = createStudent._id
            }
            
            if(createStudent){

                let jwtData = {
                    user_id: studentId,
                    first_name : first_name,
                    last_name : last_name,
                    email : email,
                    country_code : country_code,
                    mobile_no : mobile_no,
                    user_type: 5,
                    notification_device_id: notification_device_id
                }

                let sendData = {
                    user_id: studentId,
                    first_name : first_name,
                    last_name : last_name,
                    email : email,
                    country_code : country_code,
                    mobile_no : mobile_no,
                    user_type: 5,
                    user_login_type: 1,
                    last_login_type: 1
                }

                //user login history
                await UserMobileActivityModel.createUserLoginHistory({ 
                    user_id: studentId,
                    device_uuid: device_uuid,
                    firebase_token: firebase_token,
                    login_time: new Date()
                });

                let jwtToken = await GenerateSignature(jwtData);
                
                let subject = "Welcome to Virtual Vidhyapith LMS - Unlock Your Learning Potential!!";
                let message = await welcomeTemplate({ user_name: `${first_name} ${last_name}`, subject: subject});
                await sendMail(email, message, subject, studentId, "Add User"); 

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "User has been created successfully.",
                    data: sendData,
                    token: jwtToken
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Sorry! User signup failed.",
                };
            }   
        }else{
            return {
                status: false,
                status_code: constants.CONFLICT_RESPONSE,
                message: "Sorry! User signup failed.",
                id: null,
                error: errorArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addUser:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! User signup failed.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }  
}

//add user data
const importStudents = async (userInputs) => {
    try{
        const { 
            institute_id, first_name, last_name, email, country_code, mobile_no, password  
        } = userInputs;

        let errorArray = {
            password: null,
            email: null
        }

        let isValidData = true;
        let userId = null;

        //check password
        if(!await CheckPassword(password)){
            isValidData = false
            errorArray['password'] = "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character";
        }

        //check email id
        if (!email || !await ValidateEmail(email)) {
            isValidData = false
        }else{
            const getEmailData = await UserModel.fatchUserfilterData({ email: email });
            if(getEmailData !== null){
                userId = getEmailData._id
                isValidData = false
            }
        }
        
        //check mobile no
        if (mobile_no) {
            if(!await ValidateMobileNumber(mobile_no)){
                isValidData = false
            } 

            const checkMobileDuplication = await UserModel.fatchUserfilterData({ mobile_no: mobile_no });
            if(checkMobileDuplication !== null){
                userId = checkMobileDuplication._id
                isValidData = false
            }
        }

        if(isValidData){
            let salt = await GenerateSalt();
            let userPassword = await GeneratePassword(password, salt);

            const createUser = await UserModel.createUser({ 
                institute_id: institute_id,
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile_no:  mobile_no,
                country_code: country_code,
                password: userPassword,
                password_salt: salt,
                is_delete: false,
                is_verify_otp: true,
                status: 1,
                user_type: 3,
                user_signup_with: 6,
                user_referral_code: await findUserReferralCode()
            });
            userId = createUser._id
            let subject = "Welcome to Virtual Vidhyapith LMS - Unlock Your Learning Potential!!";
            let message = await welcomeWithCredetialsTemplate({ user_name: `${first_name} ${last_name}`, subject: subject, mobile_no: `+${country_code} ${mobile_no}`, password: password});
            let sendwait = await sendMail(email, message, subject, userId, "Import Student");
            
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "User has been created successfully.",
                id: createUser._id
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "User has been created successfully.",
                id: userId
            };

            // return {
            //     status: false,
            //     status_code: constants.CONFLICT_RESPONSE,
            //     message: "Sorry! User signup failed.",
            //     id: userId,
            //     error: errorArray
            // };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in importStudents:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! User signup failed.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

//send otp
const sendOtp = async (userInputs) => {
    try{
        const { mobile_no, country_code, user_id } = userInputs;
        let getUserData = null
        if(user_id){
            getUserData = await UserModel.fatchUserById(user_id);
        }else if(mobile_no){
            getUserData = await UserModel.fatchUserData(mobile_no);
        }
       
        if(getUserData !== null){
            if (getUserData?.opt_expired_at) {
                let optExpiredAt = await DateToTimestamp(getUserData.opt_expired_at);
                let currentTime = await DateToTimestamp(new Date());

                if (optExpiredAt > currentTime) {
                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: "Otp send successfully",
                    };
                }
            }

            let otp = await RandomNumber(4);
            let id = getUserData._id;
            var optExpiredAt = moment(new Date()).add(constants.OTP_EXPIRE_MINUTE, 'minutes').format("YYYY-MM-DD HH:mm:ss");

            UserModel.updateUser(id,{ 
                otp: otp,
                opt_expired_at: optExpiredAt
            });

            //Send an otp SMS :: START
            let message = "Welcome to Virtual Vidyapith! Your OTP for signup is " + otp + ". Enter it to complete your registration. Have a great learning experience!"
            let smsResponse = sendSingleSms(country_code,mobile_no, message, process.env.SMS_OTP_TEMPLATEID, id,1)
            //Send an otp SMS :: END
            
            if(smsResponse){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Otp send successfully",
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Falied to send the otp",
                };
            }
            
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Falied to send the otp",
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in sendOtp:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to send the otp.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

//verify otp
const verifyOtp = async (userInputs) => {
    try{
        const { user_id, otp } = userInputs;

        let errorArray = {
            otp: null,
            user_id: null
        }

        if(!otp){
            errorArray['otp'] = "Enter a valid otp";
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Falied to verify otp",
                error: errorArray
            };
        }

        const userData = await UserModel.fatchUserById(user_id);

        if(userData !== null){
            let isOtpValid = false;
            let failedOTPMessage;
            if (userData.opt_expired_at) {
                let optExpiredAt = await DateToTimestamp(userData.opt_expired_at);
                let currentTime = await DateToTimestamp(new Date());
                if (optExpiredAt > currentTime) {
                    if (userData.otp == otp) {
                        isOtpValid = true
                    } else {
                        isOtpValid = false
                        failedOTPMessage = "The entered OTP is incorrect. Please check and try again."
                    }
                } else {
                    isOtpValid = false
                    failedOTPMessage = "The OTP you received has expired. Please request a new OTP."
                }
            }

            if(isOtpValid){
                let id = userData._id
                UserModel.updateUser(id,{ 
                    is_verify_otp: true
                });

                const getUserData = await UserModel.fatchUserById(id);
                let jwtData = {
                    user_id: getUserData.id,
                    first_name : getUserData.first_name,
                    last_name : getUserData.last_name,
                    email : getUserData.email,
                    country_code : getUserData.country_code,
                    mobile_no : getUserData.mobile_no,
                    user_type: getUserData.user_type
                }

                let sendData = {
                    user_id: getUserData.id,
                    first_name : getUserData.first_name,
                    last_name : getUserData.last_name,
                    email : getUserData.email,
                    country_code : getUserData.country_code,
                    mobile_no : getUserData.mobile_no,
                    user_type: getUserData.user_type,
                    user_login_type: getUserData.user_signup_with,
                    last_login_type: 1
                }

                let jwtToken = await GenerateSignature(jwtData);

                let subject = "Welcome to Virtual Vidhyapith LMS - Unlock Your Learning Potential!!";
                let message = await welcomeTemplate({ user_name: `${getUserData.first_name} ${getUserData.last_name}`, subject: subject});
                await sendMail(getUserData.email, message, subject, getUserData.id, "Add User");

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "OTP has been verified successfully.",
                    data: sendData,
                    token: jwtToken
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: failedOTPMessage,
                    error: errorArray
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Falied to verify otp",
                error: errorArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in verifyOtp:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to verify otp',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

const getStudentsData = async (userInputs) => {
    try{
        const { search, startToken, endToken, institution_id, referral_code } = userInputs;
        
        const perPage = parseInt(endToken) || 10; 
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) { 
            page = perPage * page; 
        }

        const getStudentsData = await UserModel.fatchStudents(search, page, perPage, institution_id, referral_code);
        const countStudents = await UserModel.countStudents(search,institution_id,'','', referral_code);
        
        if(getStudentsData && getStudentsData?.length > 0){
            if(referral_code){
                await Promise.all(
                    await getStudentsData.map(async (element, key) => {
                        let getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: element._id });
                        await getStudentsData[key].set('isCoursePurchase', getUserCourseData?.length == 0 ? 0 : 1 ,{strict:false})
                        await getStudentsData[key].set('isSignup',  1 ,{strict:false})

                        const getHemanData = await CallAdminEvent("get_heman_user_data",{ referral_code:referral_code, user_id: element._id.toString() }, "");
                        
                        await getStudentsData[key].set('heman_share',  getHemanData?.amount ? getHemanData.amount : 0 ,{strict:false})
                        await getStudentsData[key].set('course_base_amount',  getHemanData?.course_amount ? getHemanData.course_amount : 0  ,{strict:false})
                        await getStudentsData[key].set('assign_at',  getHemanData?.assign_at ? getHemanData.assign_at : ''  ,{strict:false})
                        await getStudentsData[key].set('course_price_with_gst',  getHemanData?.course_tax_amount ? getHemanData.course_tax_amount : 0  ,{strict:false})
                    })
                )
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: getStudentsData,
                record_count : countStudents
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null,
                record_count: 0
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getStudentsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to fetch student data.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getStudentsCount = async () => {
    try{
        
        const countStudents = await UserModel.countStudents();
        
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data found successfully",
            data: countStudents
        };
     
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getStudentsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to fetch student data.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const sendForgotPasswordLink = async (userInputs) => {
    try{
        const { email } = userInputs;

        const getEmailData = await UserModel.fatchUserfilterData({ email: email });
        if(getEmailData !== null){
            const userId = (getEmailData._id).toString();
            //send mail over hear  
            let link = ''
            if(process.env.DEVELOPER_MODE == "development"){
                link = process.env.RESET_PASSWORD_LINK_LOCAL + email
            }else{
                link = process.env.RESET_PASSWORD_LINK_LIVE + email
            }
            let username = (getEmailData?.first_name ? getEmailData?.first_name : '') + " " + (getEmailData?.last_name ? getEmailData?.last_name : '')
            let subject = "Reset Your Password - Account Recovery Request";
            let message = await forgotPasswordTemplate({ user_name: username, id: email, link: link, subject: subject});
            let sendwait = await sendMail(email, message, subject, userId, "Send Forget Password Link");

            if(sendwait){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Mail send successfully"
                };
            }else{
                return {
                    status: false,
                    status_code: constants.EXCEPTION_ERROR_CODE,
                    message: 'Falied to send the mail'
                };
            }
           
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Email id is not registered with us"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in sendForgotPasswordLink:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to send the mail.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const changePassword = async (userInputs) => {
    try{
        const { email_id,new_password,confirm_password } = userInputs;

        if(new_password === confirm_password){
            //send mail over hear  
            const getEmailData = await UserModel.fatchUserfilterData({ email: email_id });

            if(getEmailData !== null){
                //send mail over hear  

                let userPassword = await GeneratePassword(new_password, getEmailData.password_salt);

                let updatePassword = UserModel.updateUser(getEmailData._id,{ 
                    password: userPassword
                });

                if(updatePassword){
                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: "Password changed successfully"
                    };
                }else{
                    return {
                        status: false,
                        status_code: constants.ERROR_RESPONSE,
                        message: "Sorry! Falied to change the password"
                    };
                }
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Email id is not registered with us"
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "New password and confirm password are not match"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in changePassword:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to change the password.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getStudentById = async (userInputs) => {
    try{
        const { id } = userInputs;

        const getUserData = await UserModel.fatchUserById(id);

        if(getUserData !== null){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data fatch successfully",
                data: getUserData
            };
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Failed to get the student data"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getStudentAccountDetail:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get the student data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }

}

const getStudentAccountDetail = async (userInputs) => {
    try{
        const { id } = userInputs;

        const getUserData = await UserModel.fatchUserDataById(id);

        if(getUserData !== null){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data fatch successfully",
                data: getUserData
            };
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Failed to get the student data"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getStudentAccountDetail:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get the student data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }

}

const updateAccountData= async (userInputs) => {
    try{
        const { id, first_name, last_name, email, country_code, mobile_no,birth_date, gender } = userInputs;

        const updateAccountData = { 
            first_name: first_name,
            last_name: last_name,
            email: email,
            birth_date: birth_date ? moment(new Date(birth_date) , "YYYY-MM-DD") : null,
            gender: gender,
            country_code: country_code
        }
        if(mobile_no.length > 0){
            updateAccountData['mobile_no'] = mobile_no;
        }
        let updateResponse = UserModel.updateUser(id,updateAccountData);

        if(updateResponse){
            const getUserData = await UserModel.fatchUserById(id);
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Account update successfully",
                data:{
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    mobile_no:  getUserData?.mobile_no,
                    birth_date: birth_date ? birth_date : null,
                    gender: gender,
                    country_code: country_code,
                    user_type: getUserData?.user_type || "",
                    user_login_type: getUserData?.user_signup_with || "",
                    last_login_type: getUserData?.last_login_type || "",
                    profile_image: getUserData?.profile_image || "",
                }
            };
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Sorry! Falied to change the password",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in updateAccountData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! Falied to change the password',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }

}

const changeAccountPassword = async (userInputs) => {
    try{
        const { id, old_password, new_password, confirm_password  } = userInputs;

        if(new_password === confirm_password){
   
            const userData = await UserModel.fatchUserById(id);

            let validPassword = await ValidatePassword(old_password, userData.password, userData.password_salt);

            if(validPassword){

                if(userData){
                    let userPassword = await GeneratePassword(new_password, userData.password_salt);

                    let updatePassword = UserModel.updateUser(userData._id,{ 
                        password: userPassword
                    });

                    if(updatePassword){
                        return {
                            status: true,
                            status_code: constants.SUCCESS_RESPONSE,
                            message: "Password changed successfully"
                        };
                    }else{
                        return {
                            status: false,
                            status_code: constants.ERROR_RESPONSE,
                            message: "Sorry! Falied to change the password"
                        };
                    }
                }else{
                    return {
                        status: false,
                        status_code: constants.DATABASE_ERROR_RESPONSE,
                        message: "User is not registered with us"
                    };
                }
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Old password is not valid",
                    error: {
                        old_password: "Old password is not valid"
                    }
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "New password and confirm password are not match",
                error: {
                    new_password: "New password and confirm password are not match",
                    confirm_password: "New password and confirm password are not match"
                }
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in changeAccountPassword:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! Falied to change the password',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const changeNotificationStatus = async (userInputs) => {
    try{
        const { id,status } = userInputs;

        let updateNotificationStatus = await UserModel.updateUser(id,{ 
            is_get_notification: status
        });

        if(updateNotificationStatus){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Nofitication status changed successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to change nofitication status"
            };
        }

    }catch (error) {
        // Handle unexpected errors
        console.error('Error in changeNotificationStatus:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to change nofitication status',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
    
}

const changeApplicationLanguage = async (userInputs) => {
    try{
        const { id,language } = userInputs;

        let updateAppLanguage = await UserModel.updateUser(id,{ 
            app_language: language
        });

        if(updateAppLanguage){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Application language changed successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to change application language"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in changeApplicationLanguage:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to change application language',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

//add user data
const addStudent = async (userInputs) => {
    try{
        const { 
            first_name, last_name, email, country_code, mobile_no, birth_date, gender, password, is_tc_verify , user_signup_with, note, institute_id, profile_image, notification_device_id
        } = userInputs;

        let errorArray = {
            password: null,
            email: null
        }

        let isValidData = true;

        const getEmailData = await UserModel.fatchUserfilterData({ email: email });
        const getInstituteEmailData = await CallAdminEvent("check_institute_email_id",{ email_id: email  }, "");
        if(getEmailData !== null || getInstituteEmailData !== null){
            isValidData = false
            errorArray['email'] = "Email id is already exists";
        }
        

        if (mobile_no) {
            const checkMobileDuplication = await UserModel.fatchUserfilterData({ mobile_no: mobile_no });
            const getInstituteMobileData = await CallAdminEvent("check_institute_mobile_no",{ mobile_no: mobile_no }, "");
            if(checkMobileDuplication !== null || getInstituteMobileData !== null){
                isValidData = false
                errorArray['mobile_no'] = "Mobile number is already exists";
            }
        }
        
        if(isValidData){
            let salt = await GenerateSalt();
            let userPassword = null;

            if(user_signup_with == 1){
                userPassword = await GeneratePassword(password, salt);
            }

            const createUserData = { 
                institute_id: institute_id ? institute_id : null,
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile_no:  mobile_no,
                birth_date: birth_date ? moment(new Date(birth_date) , "YYYY-MM-DD") : null,
                gender: gender,
                country_code: country_code,
                password: userPassword,
                password_salt: salt,
                is_deleted: false,
                status: 1,
                user_type: 5,
                user_signup_with: user_signup_with,
                note: note,
                is_tc_verify: true,
                is_verify_otp: true,
                profile_image: profile_image,
                user_referral_code: await findUserReferralCode()
            };
            if(notification_device_id){
                createUserData['notification_device_id'] = notification_device_id;
            }
            const createStudent = await UserModel.createUser(createUserData);

            if(createStudent){

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Student has been created successfully.",
                    id: createStudent._id,
                    profile_image: profile_image
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Sorry! Student signup failed.",
                };
            }   
        }else{
            return {
                status: false,
                status_code: constants.CONFLICT_RESPONSE,
                message: "Sorry! Student signup failed.",
                id: null,
                error: errorArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addStudent:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! Student signup failed.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const changeStudentPassword = async (userInputs) => {
    try{
        const { id,new_password,confirm_password } = userInputs;

        if(new_password === confirm_password){
            //send mail over hear  
            const getUserData = await UserModel.fatchUserById(id);

            if(getUserData !== null){
                //send mail over hear  

                let userPassword = await GeneratePassword(new_password, getUserData.password_salt);

                let updatePassword = UserModel.updateUser(getUserData._id,{ 
                    password: userPassword
                });

                if(updatePassword){
                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: "Password changed successfully"
                    };
                }else{
                    return {
                        status: false,
                        status_code: constants.DATABASE_ERROR_RESPONSE,
                        message: "Sorry! Falied to change the password"
                    };
                }
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Email id is not registered with us"
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "New password and confirm password are not match"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in changeStudentPassword:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! Falied to change the password',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const updateStudentData= async (userInputs) => {
    try{

        let { id,first_name, last_name, email, country_code, mobile_no, birth_date, gender, note, institute_id, profile_image } = userInputs;

        let errorArray = {
            email: "",
            mobile_no: ""
        }

        let isValidData = true;

        // check email id is valid or not
        const getEmailData = await UserModel.fatchUserfilterData({ email: email });
        const getInstituteEmailData = await CallAdminEvent("check_institute_email_id",{ email_id: email  }, "");

        if((getEmailData !== null && getEmailData._id.toString() !== id)  || getInstituteEmailData !== null){
            isValidData = false
            errorArray["email"] = "Email id is already exists"
        }
        // check mobile no is valid or not
        const checkMobileDuplication = await UserModel.fatchUserfilterData({ mobile_no: mobile_no });
        const getInstituteMobileData = await CallAdminEvent("check_institute_mobile_no",{ mobile_no: mobile_no }, "");
        if((checkMobileDuplication !== null && checkMobileDuplication._id.toString() !== id) || getInstituteMobileData !== null){
            isValidData = false
            errorArray["mobile_no"] =  "Mobile number is already exists"
        }
        
        if(isValidData){

            let updateData = {
                institute_id: institute_id,
                first_name: first_name,
                last_name: last_name,
                email: email,
                mobile_no:  mobile_no,
                birth_date: birth_date ? moment(new Date(birth_date) , "YYYY-MM-DD") : null,
                gender: gender,
                country_code: country_code,
                is_deleted: false,
                note: note
            }
            
            if(profile_image){
                const getUserData = await UserModel.fatchUserById(id);
                if(getUserData &&  getUserData?.profile_image){
                    let filePath =  getUserData.profile_image; 
                    await deleteFile(filePath);
                }
                updateData['profile_image'] = profile_image
            }

            let updateStudent = UserModel.updateUser(id,updateData);

            if(updateStudent){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Account update successfully",
                    profile_image: profile_image
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Sorry! Falied update profile"
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.CONFLICT_RESPONSE,
                message: "Sorry! Failed to update account.",
                id: null,
                error: errorArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in updateStudentData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! Falied update profile',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }

}

const deleteStudent = async (userInputs) => {
    try{
        let { id } = userInputs;
        
        const getUserData = await UserModel.fatchUserById(id);
        if(getUserData &&  getUserData?.profile_image){
            let filePath =  getUserData.profile_image; 
            await deleteFile(filePath);
        }

        let deleteStudent = UserModel.updateUser(id,{ 
            is_deleted: true
        });

        if(deleteStudent){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Student deleted successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Sorry! Falied to delete student"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in updateStudentData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! Falied to delete student',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const changeProfileImage = async (userInputs) => {
    try{
        const { id,profile_image } = userInputs;

        const getUserData = await UserModel.fatchUserById(id);
        if(getUserData &&  getUserData?.profile_image){
            let filePath =  getUserData.profile_image; 
            await deleteFile(filePath);
        }


        let updateProfileImage = await UserModel.updateUser(id,{ 
            profile_image: profile_image
        });

        if(updateProfileImage){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Profile image updated successfully",
                data:{
                    profile_image: profile_image
                }
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to update profile image",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in changeProfileImage:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to update profile image',
            error: { server_error: 'An unexpected error occurred' },
            data: null
        };
    }
}

const checkUserData = async (userInputs) => {
    const { email_id, mobile_no } = userInputs;

    const getEmailData = await UserModel.fatchUserfilterData({ email: email_id, mobile_no: mobile_no });

    return getEmailData;
}


const getLanguageData = async () => {
    try{
        const getLanguageData = await UserModel.getLanguageData();
        //get the chart data Language wise
        let hindiCount = 0;
        let gujratiCount = 0;
        let englishCount = 0;
        let totalCount = 0;
        if(getLanguageData !== null){

            if(getLanguageData.length > 0){
                if(getLanguageData[0]){
                    hindiCount = getLanguageData[0].hindi ?  getLanguageData[0].hindi : 0
                    gujratiCount = getLanguageData[0].gujrati ?  getLanguageData[0].gujrati : 0
                    englishCount = getLanguageData[0].english ?  getLanguageData[0].english : 0
                    totalCount = getLanguageData[0].total ?  getLanguageData[0].total : 0
                }
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: {
                    hindi: hindiCount,
                    gujrati: gujratiCount,
                    english: englishCount,
                    total: totalCount
                }
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: {
                    hindi: hindiCount,
                    gujrati: gujratiCount,
                    english: englishCount,
                    total: totalCount
                }
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getLanguageData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}
 
const getEnrollmentData = async () => {
    try{
        // gtusent course enrollmrnt data
        let start_date = new Date(moment(new Date()).subtract(4, 'months')).toISOString();
        const getEnrollmentData = await UserCourseModel.getCourseEnrollmentData(start_date);

        let firstMonth = moment(new Date()).subtract(3, 'months').format("YYYY-MM");
        let secondMonth = moment(new Date()).subtract(2, 'months').format("YYYY-MM");
        let thirdMonth = moment(new Date()).subtract(1, 'months').format("YYYY-MM");
        let forthMonth = moment(new Date()).format("YYYY-MM");

        let monthData = {
            first_month: 0,
            second_month: 0,
            third_month: 0,
            forth_month: 0,
        }

        if(getEnrollmentData !== null){

            if(getEnrollmentData.length > 0){
                getEnrollmentData.map((element) => {
                    if(element._id ===  firstMonth){
                        monthData["first_month"] = element.enrollment
                    }else if(element._id ===  secondMonth){
                        monthData["second_month"] = element.enrollment
                    }else if(element._id ===  thirdMonth){
                        monthData["third_month"] = element.enrollment
                    }else if(element._id ===  forthMonth){
                        monthData["forth_month"] = element.enrollment
                    }
                });

            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: monthData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getEnrollmentData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getMobileUsageInWeekData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(7, "days")).toISOString();
        const getMobileUsageData = await UserMobileActivityModel.getMobileUsageInWeekData(start_date);

        let weekData = {
            "monday" : 0,
            "tuesday" : 0,
            "wednesday" : 0,
            "thursday" : 0,
            "friday" : 0,
            "saturday" : 0,
            "sunday" : 0
        } 

        if(getMobileUsageData !== null){
            if(getMobileUsageData.length > 0){
                getMobileUsageData.map((element) => {
                    if(element._id === "1"){
                        weekData["sunday"] = element.totalMinites
                    }else if(element._id === "2"){
                        weekData["monday"] = element.totalMinites
                    }else if(element._id === "3"){
                        weekData["tuesday"] = element.totalMinites
                    }else if(element._id === "4"){
                        weekData["wednesday"] = element.totalMinites
                    }else if(element._id === "5"){
                        weekData["thursday"] = element.totalMinites
                    }else if(element._id === "6"){
                        weekData["friday"] = element.totalMinites
                    }else if(element._id === "7"){
                        weekData["saturday"] = element.totalMinites
                    }
                });
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: weekData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: weekData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getMobileUsageInWeekData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getMobileUsageInDaysData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(30, "days")).toISOString();
        const getMobileUsageInDaysData = await UserMobileActivityModel.getMobileUsageInDaysData(start_date);
        let monthArray = []
    
        if(getMobileUsageInDaysData !== null){
            if(getMobileUsageInDaysData.length > 0){
            await getMobileUsageInDaysData.map((element) => {
                    monthArray[element._id] = element.totalMinites
                });
            }

            let dataArray = [];
            var start = start_date;
            var end = new Date();
            
            
            var loop = new Date(start);
            while(loop <= end){       
                
                let DateFormate = moment(loop).format("MM-DD")
                if(monthArray[DateFormate]){
                    dataArray.push({
                        day: DateFormate,
                        value: parseFloat(monthArray[DateFormate])
                    })
                }else{
                    dataArray.push({
                        day: DateFormate,
                        value: 0
                    })
                }
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getMobileUsageInDaysData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getMobileUsageInMonthData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(12, 'months')).toISOString();
        const getMobileUsageInMonthData = await UserMobileActivityModel.getMobileUsageInMonthData(start_date);
        let monthArray = []

        if(getMobileUsageInMonthData !== null){
            if(getMobileUsageInMonthData.length > 0){
                await getMobileUsageInMonthData.map((element) => {
                    monthArray[element._id] = element.totalMinites
                });
            }

            let dataArray = [];
            var month = moment(new Date()).format("MM");
            var year = moment(new Date()).format("YYYY");

            for (var i = 1; i <= 12; i++) {
                if(monthArray[year+"-"+month]){
                    dataArray.push({
                        month: year + "-" + month,
                        value: parseFloat(monthArray[year+"-"+month])
                    })
                }else{
                    dataArray.push({
                        month: year + "-" + month,
                        value: 0
                    })
                }
                month = moment(new Date()).subtract(i, 'months').format("MM");
                year = moment(new Date()).subtract(i, 'months').format("YYYY");
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getMobileUsageInMonthData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getLoginHistoryInWeekData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(7, "days")).toISOString();
        const getMobileUsageData = await UserMobileActivityModel.getLoginHistoryData(start_date, "%w");

        let weekData = {
            "monday" : 0,
            "tuesday" : 0,
            "wednesday" : 0,
            "thursday" : 0,
            "friday" : 0,
            "saturday" : 0,
            "sunday" : 0
        } 

        if(getMobileUsageData !== null){
            if(getMobileUsageData.length > 0){
                getMobileUsageData.map((element) => {
                    if(element._id === "1"){
                        weekData["sunday"] = element.userCount
                    }else if(element._id === "2"){
                        weekData["monday"] = element.userCount
                    }else if(element._id === "3"){
                        weekData["tuesday"] = element.userCount
                    }else if(element._id === "4"){
                        weekData["wednesday"] = element.userCount
                    }else if(element._id === "5"){
                        weekData["thursday"] = element.userCount
                    }else if(element._id === "6"){
                        weekData["friday"] = element.userCount
                    }else if(element._id === "7"){
                        weekData["saturday"] = element.userCount
                    }
                });
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: weekData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: weekData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getLoginHistoryInWeekData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getLoginHistoryInDaysData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(30, "days")).toISOString();
        const getMobileUsageInDaysData = await UserMobileActivityModel.getLoginHistoryData(start_date,"%m-%d");
        let monthArray = []
    
        if(getMobileUsageInDaysData !== null){
            if(getMobileUsageInDaysData.length > 0){
            await getMobileUsageInDaysData.map((element) => {
                    monthArray[element._id] = element.userCount
                });
            }

            let dataArray = [];
            var start = start_date;
            var end = new Date();
            
            
            var loop = new Date(start);
            while(loop <= end){       
                
                let DateFormate = moment(loop).format("MM-DD")
                if(monthArray[DateFormate]){
                    dataArray.push({
                        day: DateFormate,
                        value: parseFloat(monthArray[DateFormate])
                    })
                }else{
                    dataArray.push({
                        day: DateFormate,
                        value: 0
                    })
                }
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getLoginHistoryInDaysData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getLoginHistoryInMonthData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(12, 'months')).toISOString();
        const getMobileUsageInMonthData = await UserMobileActivityModel.getLoginHistoryData(start_date, "%Y-%m");
        let monthArray = []

        if(getMobileUsageInMonthData !== null){
            if(getMobileUsageInMonthData.length > 0){
                await getMobileUsageInMonthData.map((element) => {
                    monthArray[element._id] = element.userCount
                });
            }

            let dataArray = [];
            var month = moment(new Date()).format("MM");
            var year = moment(new Date()).format("YYYY");

            for (var i = 1; i <= 12; i++) {
                if(monthArray[year+"-"+month]){
                    dataArray.push({
                        month: year + "-" + month,
                        value: parseFloat(monthArray[year+"-"+month])
                    })
                }else{
                    dataArray.push({
                        month: year + "-" + month,
                        value: 0
                    })
                }
                month = moment(new Date()).subtract(i, 'months').format("MM");
                year = moment(new Date()).subtract(i, 'months').format("YYYY");
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getLoginHistoryInMonthData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getRegistrationHistoryInWeekData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(7, "days")).toISOString();
        const getMobileUsageData = await UserModel.getRegistrationHistoryData(start_date, "%w");

        let weekData = {
            "monday" : 0,
            "tuesday" : 0,
            "wednesday" : 0,
            "thursday" : 0,
            "friday" : 0,
            "saturday" : 0,
            "sunday" : 0
        } 

        if(getMobileUsageData !== null){
            if(getMobileUsageData.length > 0){
                getMobileUsageData.map((element) => {
                    if(element._id === "1"){
                        weekData["sunday"] = element.userCount
                    }else if(element._id === "2"){
                        weekData["monday"] = element.userCount
                    }else if(element._id === "3"){
                        weekData["tuesday"] = element.userCount
                    }else if(element._id === "4"){
                        weekData["wednesday"] = element.userCount
                    }else if(element._id === "5"){
                        weekData["thursday"] = element.userCount
                    }else if(element._id === "6"){
                        weekData["friday"] = element.userCount
                    }else if(element._id === "7"){
                        weekData["saturday"] = element.userCount
                    }
                });
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: weekData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: weekData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getRegistrationHistoryInWeekData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getRegistrationHistoryInDaysData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(30, "days")).toISOString();
        const getMobileUsageInDaysData = await UserModel.getRegistrationHistoryData(start_date,"%m-%d");
        let monthArray = []
    
        if(getMobileUsageInDaysData !== null){
            if(getMobileUsageInDaysData.length > 0){
            await getMobileUsageInDaysData.map((element) => {
                    monthArray[element._id] = element.userCount
                });
            }

            let dataArray = [];
            var start = start_date;
            var end = new Date();
            
            
            var loop = new Date(start);
            while(loop <= end){       
                
                let DateFormate = moment(loop).format("MM-DD")
                if(monthArray[DateFormate]){
                    dataArray.push({
                        day: DateFormate,
                        value: parseFloat(monthArray[DateFormate])
                    })
                }else{
                    dataArray.push({
                        day: DateFormate,
                        value: 0
                    })
                }
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getRegistrationHistoryInDaysData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getRegistrationHistoryInMonthData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(12, 'months')).toISOString();
        const getMobileUsageInMonthData = await UserModel.getRegistrationHistoryData(start_date, "%Y-%m");
        let monthArray = []

        if(getMobileUsageInMonthData !== null){
            if(getMobileUsageInMonthData.length > 0){
                await getMobileUsageInMonthData.map((element) => {
                    monthArray[element._id] = element.userCount
                });
            }

            let dataArray = [];
            var month = moment(new Date()).format("MM");
            var year = moment(new Date()).format("YYYY");

            for (var i = 1; i <= 12; i++) {
                if(monthArray[year+"-"+month]){
                    dataArray.push({
                        month: year + "-" + month,
                        value: parseFloat(monthArray[year+"-"+month])
                    })
                }else{
                    dataArray.push({
                        month: year + "-" + month,
                        value: 0
                    })
                }
                month = moment(new Date()).subtract(i, 'months').format("MM");
                year = moment(new Date()).subtract(i, 'months').format("YYYY");
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getRegistrationHistoryInMonthData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}
 
const getCourseEnrollmentDataCourseWise = async (request) => {
    try{
        const getEnrollmentData = await UserCourseModel.getCourseEnrollmentDataCourseWise();

        let courseData = []

        if(getEnrollmentData !== null){

            if(getEnrollmentData.length > 0){
                let promiseData = await new Promise(async (resolve, reject) => {
                    let count = 0 ;
                    await getEnrollmentData.map(async (element) => {
                        let course = await CallCourseQueryEvent("get_course_data_without_auth",{ id: element._id  }, request.get("Authorization"))
                        
                        await courseData.push({
                            course_id: element._id,
                            enrollment: element.enrollment,
                            course_title: course.course_title ? course.course_title : null
                        })
                        count = count + 1
                        if (getEnrollmentData.length === count) {
                            resolve(courseData)
                        }
                    });
                })

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data found successfully",
                    data: promiseData
                };
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data found successfully",
                    data: courseData
                };
            }
            
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCourseEnrollmentDataCourseWise:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getCourseCompletionRateCourseWise = async (request) => {
    try{
        let start_date = new Date(moment(new Date()).subtract(7, "days")).toISOString();

        const getCourseCompletionRateData = await CourseWatchHistoryModel.getCourseCompletionRateCourseWise();
        const getCourseCompletionRateDataInweek = await CourseWatchHistoryModel.getCourseCompletionRateCourseWiseInWeek(start_date);

        let dataArray = [];
        if(getCourseCompletionRateDataInweek !== null){
            let monthArray = [];
            if(getCourseCompletionRateDataInweek.length > 0){
                await getCourseCompletionRateDataInweek.map((element) => {
                    monthArray[element._id] = element.course_id
                });
            }

        
            var month = moment(new Date()).format("MM");
            var year = moment(new Date()).format("YYYY");

            for (var i = 1; i <= 12; i++) {

                if(monthArray[year+"-"+month]){
                    let idArray = await monthArray[year+"-"+month]
                    var map = idArray.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});

                    dataArray.push({
                        month: year + "-" + month,
                        course_id: idArray.length > 0 ? map : null
                    })
                }else{
                    dataArray.push({
                        month: year + "-" + month,
                        course_id: null
                    })
                }
                month = moment(new Date()).subtract(i, 'months').format("MM");
                year = moment(new Date()).subtract(i, 'months').format("YYYY");
            }
        }

        let courseData = []

        if(getCourseCompletionRateData !== null){

            if(getCourseCompletionRateData.length > 0){
                let promiseData = await new Promise(async (resolve, reject) => {
                    let count = 0 ;
                    await getCourseCompletionRateData.map(async (element) => {
                        let course = await CallCourseQueryEvent("get_course_data_without_auth",{ id: element._id  }, request.get("Authorization"))
                        
                        await courseData.push({
                            course_id: element._id,
                            complete: element.complete,
                            not_complete: element.not_complete,
                            course_title: course?.course_title ? course.course_title : null
                        })
                        count = count + 1
                        if (getCourseCompletionRateData.length === count) {
                            resolve(courseData)
                        }
                    });
                })

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data found successfully",
                    data: promiseData,
                    course_chart: dataArray
                };
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data found successfully",
                    data: courseData,
                    course_chart: dataArray
                };
            }
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCourseCompletionRateCourseWise:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getRegistrationRateInWeekData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(7, "days")).toISOString();
        const getRgistrationRateInWeek = await UserModel.getRegistrationRateData(start_date, "%w");

        let weekData = {
            "monday" : 0,
            "tuesday" : 0,
            "wednesday" : 0,
            "thursday" : 0,
            "friday" : 0,
            "saturday" : 0,
            "sunday" : 0
        } 

        if(getRgistrationRateInWeek !== null){
            if(getRgistrationRateInWeek.length > 0){
                getRgistrationRateInWeek.map((element) => {
                    if(element._id === "1"){
                        weekData["sunday"] = element.userCount
                    }else if(element._id === "2"){
                        weekData["monday"] = element.userCount
                    }else if(element._id === "3"){
                        weekData["tuesday"] = element.userCount
                    }else if(element._id === "4"){
                        weekData["wednesday"] = element.userCount
                    }else if(element._id === "5"){
                        weekData["thursday"] = element.userCount
                    }else if(element._id === "6"){
                        weekData["friday"] = element.userCount
                    }else if(element._id === "7"){
                        weekData["saturday"] = element.userCount
                    }
                });
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: weekData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: weekData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getRegistrationRateInWeekData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getRegistrationRateInDaysData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(30, "days")).toISOString();
        const getMobileUsageInDaysData = await UserModel.getRegistrationRateData(start_date,"%m-%d");
        let monthArray = []
    
        if(getMobileUsageInDaysData !== null){
            if(getMobileUsageInDaysData.length > 0){
            await getMobileUsageInDaysData.map((element) => {
                    monthArray[element._id] = element.userCount
                });
            }

            let dataArray = [];
            var start = start_date;
            var end = new Date();
            
            
            var loop = new Date(start);
            while(loop <= end){       
                
                let DateFormate = moment(loop).format("MM-DD")
                if(monthArray[DateFormate]){
                    dataArray.push({
                        day: DateFormate,
                        value: parseFloat(monthArray[DateFormate])
                    })
                }else{
                    dataArray.push({
                        day: DateFormate,
                        value: 0
                    })
                }
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getRegistrationRateInDaysData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getRegistrationRateInMonthData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(12, 'months')).toISOString();
        const getMobileUsageInMonthData = await UserModel.getRegistrationRateData(start_date, "%Y-%m");
        let monthArray = []

        if(getMobileUsageInMonthData !== null){
            if(getMobileUsageInMonthData.length > 0){
                await getMobileUsageInMonthData.map((element) => {
                    monthArray[element._id] = element.userCount
                });
            }

            let dataArray = [];
            var month = moment(new Date()).format("MM");
            var year = moment(new Date()).format("YYYY");

            for (var i = 1; i <= 12; i++) {
                if(monthArray[year+"-"+month]){
                    dataArray.push({
                        month: year + "-" + month,
                        value: parseFloat(monthArray[year+"-"+month])
                    })
                }else{
                    dataArray.push({
                        month: year + "-" + month,
                        value: 0
                    })
                }
                month = moment(new Date()).subtract(i, 'months').format("MM");
                year = moment(new Date()).subtract(i, 'months').format("YYYY");
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getRegistrationRateInMonthData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getCourseEnrollmentRateInWeekData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(7, "days")).toISOString();
        const getRgistrationRateInWeek = await UserCourseModel.getCourseEnrollmentRateData(start_date, "%w");

        let weekData = {
            "monday" : 0,
            "tuesday" : 0,
            "wednesday" : 0,
            "thursday" : 0,
            "friday" : 0,
            "saturday" : 0,
            "sunday" : 0
        } 

        if(getRgistrationRateInWeek !== null){
            if(getRgistrationRateInWeek.length > 0){
                getRgistrationRateInWeek.map((element) => {
                    if(element._id === "1"){
                        weekData["sunday"] = element.userCount
                    }else if(element._id === "2"){
                        weekData["monday"] = element.userCount
                    }else if(element._id === "3"){
                        weekData["tuesday"] = element.userCount
                    }else if(element._id === "4"){
                        weekData["wednesday"] = element.userCount
                    }else if(element._id === "5"){
                        weekData["thursday"] = element.userCount
                    }else if(element._id === "6"){
                        weekData["friday"] = element.userCount
                    }else if(element._id === "7"){
                        weekData["saturday"] = element.userCount
                    }
                });
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: weekData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: weekData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCourseEnrollmentRateInWeekData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getCourseEnrollmentRateInDaysData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(30, "days")).toISOString();
        const getMobileUsageInDaysData = await UserCourseModel.getCourseEnrollmentRateData(start_date,"%m-%d");
        let monthArray = []
    
        if(getMobileUsageInDaysData !== null){
            if(getMobileUsageInDaysData.length > 0){
            await getMobileUsageInDaysData.map((element) => {
                    monthArray[element._id] = element.userCount
                });
            }

            let dataArray = [];
            var start = start_date;
            var end = new Date();
            
            
            var loop = new Date(start);
            while(loop <= end){       
                
                let DateFormate = moment(loop).format("MM-DD")
                if(monthArray[DateFormate]){
                    dataArray.push({
                        day: DateFormate,
                        value: parseFloat(monthArray[DateFormate])
                    })
                }else{
                    dataArray.push({
                        day: DateFormate,
                        value: 0
                    })
                }
                var newDate = loop.setDate(loop.getDate() + 1);
                loop = new Date(newDate);
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCourseEnrollmentRateInDaysData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getCourseEnrollmentRateInMonthData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(12, 'months')).toISOString();
        const getMobileUsageInMonthData = await UserCourseModel.getCourseEnrollmentRateData(start_date, "%Y-%m");
        let monthArray = []

        if(getMobileUsageInMonthData !== null){
            if(getMobileUsageInMonthData.length > 0){
                await getMobileUsageInMonthData.map((element) => {
                    monthArray[element._id] = element.userCount
                });
            }

            let dataArray = [];
            var month = moment(new Date()).format("MM");
            var year = moment(new Date()).format("YYYY");

            for (var i = 1; i <= 12; i++) {
                if(monthArray[year+"-"+month]){
                    dataArray.push({
                        month: year + "-" + month,
                        value: parseFloat(monthArray[year+"-"+month])
                    })
                }else{
                    dataArray.push({
                        month: year + "-" + month,
                        value: 0
                    })
                }
                month = moment(new Date()).subtract(i, 'months').format("MM");
                year = moment(new Date()).subtract(i, 'months').format("YYYY");
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: monthArray
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCourseEnrollmentRateInMonthData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getLoginFrequencyData = async () => {
    try{
        const getUserMobileActivitysData = await UserMobileActivityModel.getLoginFrequencyData();
        
        if(getUserMobileActivitysData !== null){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getUserMobileActivitysData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getLoginFrequencyData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getCourseEnrollmentPercentageInWeekData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(12, 'months')).toISOString();
        const getRgistrationRateInWeek = await UserCourseModel.getCourseEnrollmentPercentageData(start_date);
        let monthArray = []
        if(getRgistrationRateInWeek !== null){

            if(getRgistrationRateInWeek.length > 0){
                await getRgistrationRateInWeek.map((element) => {
                    monthArray[element._id] = element.percentage
                });
            }

            let dataArray = [];
            var month = moment(new Date()).format("MM");
            var year = moment(new Date()).format("YYYY");

            for (var i = 1; i <= 12; i++) {
                if(monthArray[year+"-"+month]){
                    dataArray.push({
                        month: year + "-" + month,
                        value: monthArray[year+"-"+month]
                    })
                }else{
                    dataArray.push({
                        month: year + "-" + month,
                        value: null
                    })
                }
                month = moment(new Date()).subtract(i, 'months').format("MM");
                year = moment(new Date()).subtract(i, 'months').format("YYYY");
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: dataArray
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: weekData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCourseEnrollmentPercentageInWeekData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getCourseCompletionRateData = async () => {
    try{
        let start_date = new Date(moment(new Date()).subtract(1, 'months')).toISOString();
        const getCourseCompletionRate = await CourseWatchHistoryModel.getCourseCompletionRateData(start_date);
        
        if(getCourseCompletionRate !== null){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: getCourseCompletionRate
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCourseCompletionRateData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getAllStudent = async (userInputs) => {
    try{
        const getStudentsData = await UserModel.getAllStudent(userInputs);
    
        if(getStudentsData !== null){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: getStudentsData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getAllStudent:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const resetProfileImage = async (userInputs) => {
    try{
        let { id } = userInputs;
        
        const getUserData = await UserModel.fatchUserById(id);
        if(getUserData &&  getUserData?.profile_image){
            let filePath =  getUserData.profile_image; 
            await deleteFile(filePath);
        }

        let deleteStudent = UserModel.updateUser(id,{ 
            profile_image: null
        });

        if(deleteStudent){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Profile image deleted successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Sorry! Falied to delete profile image"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in resetProfileImage:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! Falied to profile image',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

//check Mobile No
const checkMobileNo = async (userInputs) => {
    try{
        const { user_id, mobile_no, country_code } = userInputs;
        const checkMobileDuplication = await UserModel.fatchUserfilterData({ mobile_no: mobile_no });
        if(checkMobileDuplication !== null){
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Mobile no is already exists",
                error: {
                    mobile_no: "Mobile no is already exists"
                }
            };
        }else{
            let otp = await RandomNumber(4);
            var optExpiredAt = moment(new Date()).add(constants.OTP_EXPIRE_MINUTE, 'minutes').format("YYYY-MM-DD HH:mm:ss");

            UserModel.updateUser(user_id,{ 
                otp: otp,
                opt_expired_at: optExpiredAt
            });

            //Send an otp SMS :: START
            let message = "Welcome to Virtual Vidyapith! Your OTP for signup is " + otp + ". Enter it to complete your registration. Have a great learning experience!"
            let smsResponse = await sendSingleSms(country_code,mobile_no, message, process.env.SMS_OTP_TEMPLATEID, user_id,1)
            //Send an otp SMS :: END
            
            if(smsResponse){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Otp send successfully",
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Falied to send the otp",
                    error: {
                        otp: "Falied to send the otp"
                    }
                };
            } 
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in sendOtp:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to send the otp.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

//verify otp
const verifyMobileOtp = async (userInputs) => {
    try{
        const { user_id, otp, mobile_no, country_code } = userInputs;

        const userData = await UserModel.fatchUserById(user_id);

        if(userData !== null){
            let isOtpValid = false;
            if (userData.opt_expired_at) {
                let optExpiredAt = await DateToTimestamp(userData.opt_expired_at);
                let currentTime = await DateToTimestamp(new Date());

                if (optExpiredAt > currentTime) {
                    
                    if (userData.otp == otp) {
                        isOtpValid = true
                    } else {
                        isOtpValid = false
                    }
                } else {
                    isOtpValid = false
                }
            }

            if(isOtpValid){
            
                UserModel.updateUser(user_id,{ 
                    country_code : country_code,
                    mobile_no : mobile_no,
                    is_verify_otp: true
                });

                let jwtData = {
                    user_id: userData.id,
                    first_name : userData.first_name,
                    last_name : userData.last_name,
                    email : userData.email,
                    country_code : country_code,
                    mobile_no : mobile_no,
                    user_type: userData.user_type
                }

                let sendData = {
                    user_id: userData.id,
                    first_name : userData.first_name,
                    last_name : userData.last_name,
                    email : userData.email,
                    country_code : country_code,
                    mobile_no : mobile_no,
                    user_type: userData.user_type,
                    user_login_type: userData.user_signup_with,
                    last_login_type: 1,
                    profile_image: userData?.profile_image || ''
                }

                let jwtToken = await GenerateSignature(jwtData);

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Otp verified successfully",
                    data: sendData,
                    token: jwtToken
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Invalid otp or time expired.Please resend the otp."
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Falied to verify otp"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in verifyOtp:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to verify otp',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    } 
}

const getAgeData = async (userInputs) => {
    const { start_date, end_date } = userInputs;
    try{

        let startDate = new Date(start_date).toISOString();
        let endDate = new Date(end_date + " 23:59:59").toISOString();
       
        //get the chart data age wise
        const getAgeData = await UserModel.getAgeData(startDate, endDate);

        let totalUserCount = 0;
        let averageCount = 0;
        let firstRangeCount = 0;
        let firstRangePer = 0;
        let secondRangeCount = 0;
        let secondRangePer = 0;
        let thirdRangeCount = 0;;
        let thirdRangePer = 0;
        let forthRangeCount = 0;;
        let forthRangePer = 0;
        let fifthRangeCount = 0;;
        let fifthRangePer = 0;

        if(getAgeData !== null){
            if(getAgeData.length > 0){
                getAgeData.map((ageElement) => {
                    if(ageElement.age == "below 16"){
                        totalUserCount = totalUserCount + ageElement.personas
                        firstRangeCount = ageElement.personas
                    }else if(ageElement.age == "17 - 28"){
                        totalUserCount = totalUserCount + ageElement.personas
                        secondRangeCount = ageElement.personas
                    }else if(ageElement.age == "28 - 45"){
                        totalUserCount = totalUserCount + ageElement.personas
                        thirdRangeCount = ageElement.personas
                    }else if(ageElement.age == "45+"){
                        totalUserCount = totalUserCount + ageElement.personas
                        forthRangeCount = ageElement.personas
                    }else{
                        totalUserCount = totalUserCount + ageElement.personas
                        fifthRangeCount = ageElement.personas
                    }
                });

                averageCount = totalUserCount > 0 ? totalUserCount / 3 : 0;
                firstRangePer =  firstRangeCount > 0 ? firstRangeCount * 100/ totalUserCount : 0;
                secondRangePer = secondRangeCount > 0 ? secondRangeCount * 100 / totalUserCount : 0;
                thirdRangePer = thirdRangeCount > 0 ? thirdRangeCount * 100 / totalUserCount : 0;
                forthRangePer = forthRangeCount > 0 ? forthRangeCount * 100 / totalUserCount : 0;
                fifthRangePer = fifthRangeCount > 0 ? fifthRangeCount * 100 / totalUserCount : 0;
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: {
                    total_user_count: totalUserCount,
                    average_count: averageCount,
                    first_range_count: firstRangeCount,
                    first_range_per: firstRangePer,
                    second_range_count: secondRangeCount,
                    second_range_per: secondRangePer,
                    third_range_count: thirdRangeCount,
                    third_range_per: thirdRangePer,
                    forth_range_count: forthRangeCount,
                    forth_range_per: forthRangePer,
                    fifth_range_count: fifthRangeCount,
                    fifth_range_per: fifthRangePer,
                }
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: {
                    total_user_count: totalUserCount,
                    average_count: averageCount,
                    first_range_count: firstRangeCount,
                    first_range_per: firstRangePer,
                    second_range_count: secondRangeCount,
                    second_range_per: secondRangePer,
                    third_range_count: thirdRangeCount,
                    third_range_per: thirdRangePer
                }
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getAgeData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getGenderData = async (userInputs) => {
    const { start_date, end_date } = userInputs;
    try{
      
        let startDate = new Date(start_date).toISOString();
        let endDate = new Date(end_date + " 23:59:59").toISOString();

        //get the chart data gender wise
        const getGenderData = await UserModel.getGenderData(startDate, endDate);

        let maleCount = 0;
        let femaleCount = 0;
        let totalCount = 0;
        if(getGenderData !== null){

            if(getGenderData?.length > 0){
                if(getGenderData[0]){
                    maleCount = getGenderData[0].male ?  getGenderData[0].male : 0
                    femaleCount = getGenderData[0].female ?  getGenderData[0].female : 0
                    totalCount = getGenderData[0].total ?  getGenderData[0].total : 0
                }
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: {
                    male: maleCount,
                    female: femaleCount,
                    total: totalCount
                }
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: {
                    male: maleCount,
                    female: femaleCount,
                    total: totalCount
                }
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getGenderData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getStateWiseLocationDistributionData = async (userInputs) => {
    const { start_date, end_date } = userInputs;
    try{
        let startDate = new Date(start_date).toISOString();
        let endDate = new Date(end_date + " 23:59:59").toISOString();

        const locationDistributionData = await UserModel.getStateWiseLocationDistributionData(startDate, endDate);
    
        if(locationDistributionData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: locationDistributionData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: locationDistributionData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getLocationDistributionData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}
 
const getCityWiseLocationDistributionData = async (userInputs) => {
    const { start_date, end_date } = userInputs;
    try{
        let startDate = new Date(start_date).toISOString();
        let endDate = new Date(end_date).toISOString();

        const locationDistributionData = await UserModel.getCityWiseLocationDistributionData(startDate, endDate);
    
        if(locationDistributionData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: locationDistributionData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: locationDistributionData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCityWiseLocationDistributionData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getSignupDistribution = async (userInputs) => {
    const { start_date, end_date } = userInputs;
    try{
        let startDate = new Date(start_date).toISOString();
        let endDate = new Date(end_date + " 23:59:59").toISOString();

        const signupDistribution = await UserModel.getSignupDistribution(startDate, endDate);
    
        let responseData = {
            mobile: 0,
            laptop: 0,
            desktop: 0,
            tablet: 0,
            not_any: 0
        }
        if(signupDistribution){
            await Promise.all(
                signupDistribution.map((element) => {
                    if(element._id == "mobile"){
                        responseData['mobile'] = element.count
                    }else if(element._id == "laptop"){
                        responseData['laptop'] = element.count
                    }else if(element._id == "desktop"){
                        responseData['desktop'] = element.count
                    }else if(element._id == "tablet"){
                        responseData['tablet'] = element.count
                    }else{
                        responseData['not_any'] = element.count
                    }
                })
            )
           
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: responseData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: responseData
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in signupDistribution:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getOSUsage = async (userInputs) => {
    const { start_date, end_date } = userInputs;
    try{

        let startDate = new Date(start_date).toISOString();
        let endDate = new Date(end_date + " 23:59:59").toISOString();

        const osUsage = await UserModel.getOSUsage(startDate, endDate);
    
        let responseData = {
            ios: 0,
            ios_per: 0,
            android: 0,
            android_per: 0,
            not_any: 0,
            not_any_per: 0,
        }
       
        if(osUsage){
            let countTotalRecord = 0
            let notAnyCount = 0
            await Promise.all(
                await osUsage.map((element) => {
                    if(element._id == "ios"){
                        countTotalRecord = countTotalRecord + element.count
                        responseData['ios'] = element.count
                    }else if(element._id == "android"){
                        countTotalRecord = countTotalRecord + element.count
                        responseData['android'] = element.count
                    }else{
                        countTotalRecord = countTotalRecord + element.count
                        notAnyCount = notAnyCount + element.count
                        responseData['not_any'] = notAnyCount
                    }
                })
            )

            responseData['ios_per'] = responseData?.ios > 0 ? responseData.ios * 100/ countTotalRecord : 0;
            responseData['android_per'] = responseData?.android > 0 ? responseData.android * 100/ countTotalRecord : 0;
            responseData['not_any_per'] = responseData?.not_any > 0 ? responseData.not_any * 100/ countTotalRecord : 0;
           
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: responseData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: osUsage
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in osUsage:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}
 
const userBase = async (userInputs) => {
    const { start_date, end_date } = userInputs;
    try{
        let startDate = new Date(start_date).toISOString();
        let endDate = new Date(end_date + " 23:59:59").toISOString();

        let nonPremium = await UserCourseModel.getUserBaseCount({ type: 1 , startDate, endDate})
        let premium = await UserCourseModel.getUserBaseCount({ type: 2, startDate, endDate })
        let notHavingCourse = await UserModel.countStudents(null,null,null,null,null,true)
        let totalStudent = nonPremium + premium + notHavingCourse

        let nonPremiumPer = nonPremium > 0 ? nonPremium * 100/ totalStudent : 0;
        let premiumPer = premium > 0 ? premium * 100/ totalStudent : 0;
        let notHavingCoursePer = notHavingCourse > 0 ? notHavingCourse * 100/ totalStudent : 0;

        let responseData = {
            total_user : totalStudent,
            non_premium: nonPremium,
            non_premium_per: nonPremiumPer,
            premium: premium,
            premium_per: premiumPer,
            not_having_course: notHavingCourse,
            not_having_course_per: notHavingCoursePer
        }
        
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data found successfully",
            data: responseData
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in osUsage:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const userEngagement = async (userInputs) => {
    const { start_date, end_date } = userInputs;
    try{
        let startDate = new Date(start_date).toISOString();
        let endDate = new Date(end_date + " 23:59:59").toISOString();

        let responseData = await UserMobileActivityModel.getUserEngagement({ startDate, endDate });

        let hoursData = []
        if(responseData){
            responseData.map(element => {
                hoursData[element._id] = element.count
            });
        }

        let hoursDataResponse = []
        for (let i = 1; i < 25; i++) {
            hoursDataResponse.push({
                hour : i,
                userCount : hoursData[i] ?? 0
            })
        }
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data found successfully",
            data: hoursDataResponse
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in osUsage:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const saveEmailLogs = async (userInputs) => {
    const { 
        user_id,
        message_id,
        from,
        to,
        subject,
        module,
        response,
    } = userInputs;
    try{
        EmailLogsModel.createEmailLog({
            user_id,
            message_id,
            from,
            to,
            subject,
            module,
            response,
        })
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data saved successfully",
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in saveEmailLogs:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }
}

const getStudentsByIds = async (studentIds) => {
    try{
        const getStudentsData = await UserModel.getStudentsByIds(studentIds);
        if(getStudentsData !== null){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: getStudentsData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null,
                record_count: 0
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getStudentsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Falied to fetch student data.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const testNotification = async () => {
    const req = {
        notification_device_id: ["694cc821-bf0d-4135-89ce-3f7365839570"],
        // notification_device_id: ["5f6aea46-b511-40c1-ad55-5ed0c8853a49"],	
        message: "Course has been purchased successfully.",
        template_id: "20a140f6-66bb-4995-94af-0a58632afd31"
    }
    const response = await sendPushNotification(req);

    // await sendPushNotification({notification_device_id:[getUserData?.notification_device_id], message: "", template_id: "20a140f6-66bb-4995-94af-0a58632afd31"})
    //console.log('response :: ',response);
}

//add user data
const assignReferralCode = async (userInputs) => {
    try{
        const { referral_code, user_id } = userInputs;

        if(referral_code){
            const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: user_id });
            if(getUserCourseData?.length == 0){
                UserModel.updateUser(user_id,{
                    referral_code: referral_code
                });
            }
        }
      
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data saved successfully"
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addUser:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Sorry! User signup failed.',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }  
}


//add user data
const cityDropdown = async () => {
    try{

        const getUserCourseData = await UserModel.getCityList();
     
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data list successfully",
            data: getUserCourseData
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addUser:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }  
}

//add user data
const stateDropdown = async () => {
    try{

        const getUserCourseData = await UserModel.getStateList();
     
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data list successfully",
            data: getUserCourseData
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addUser:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }  
}

//add user data
const studentData = async (userInputs) => {
    try{
        const { city, state, start_date, end_date, age_group, gender, is_count_record } = userInputs;

        const studentData = await UserModel.studentData({ city, state, start_date, end_date, age_group, gender, is_count_record });
     
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data list successfully",
            data: studentData
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in addUser:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }  
}

const changeHemanStatus= async (userInputs) => {
    try{

        let { id,heman_status } = userInputs;

        let updateData = {
            is_heman: heman_status
        }
    
        let updateStudent = UserModel.updateUser(id,updateData);

        if(updateStudent){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Account update successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Sorry! Falied update status"
            };
        }
       
    }catch (error) {
        // Handle unexpected errors
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }

}

const userReferral= async (userInputs) => {
    try{

        let { id, referral_code, user_referral_code } = userInputs;

        const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: id });
        if(getUserCourseData?.length == 0){
            let updateUserData = {}
            if(referral_code){
                updateUserData['referral_code'] = referral_code
                updateUserData['referral_type'] = 1
            }else if(user_referral_code){
                updateUserData['users_referral_code'] = user_referral_code
                updateUserData['referral_type'] = 2
            }

            let updateStudent = UserModel.updateUser(id,updateUserData);

            if(updateStudent){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Referral successfully"
                };
            }else{
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Sorry! Falied to referral"
                };
            }
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Referral successfully"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }

}

const getCouponUserList= async (userInputs) => {
    
    try{
        
        const { coupon_students, list_type, search, startToken, endToken } = userInputs;
        
        const perPage = parseInt(endToken) || 10; 
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) { 
            page = perPage * page; 
        }

        const getStudentsData = await UserModel.getCouponUserList({coupon_students, list_type, perPage, page, search });
    
        if(getStudentsData?.length > 0){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data found successfully",
                data: getStudentsData
            };
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }

}

//add user data
const sendDailyReportMail = async () => {
    try{
        let data = {}
        //yesterday signup user
        let startDate = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString()
        let endDate = new Date(new Date().setUTCHours(23, 59, 59, 999)).toISOString()

        let todaySignup = await UserModel.countStudents( "", "", startDate, endDate)
        data['todaySignup'] = todaySignup

        let todayReferral = await UserModel.countStudents( "", "", startDate, endDate, 1)
        data['todayReferral'] = todayReferral

        //get the chart data age wise
        const todayAgeData = await UserModel.dailyReportAgeData(startDate, endDate);
        data['todayAgeData'] = todayAgeData

        let firstRangeCount = 0;
        let secondRangeCount = 0;
        let thirdRangeCount = 0;
        let forthRangeCount = 0;
        
        let todayAgeRagngeData = {
            first_range_count: firstRangeCount,
            second_range_count: secondRangeCount,
            third_range_count: thirdRangeCount,
            forth_range_count: forthRangeCount
        }

        if(todayAgeData && todayAgeData?.length > 0){
            todayAgeData.map((ageElement) => {
                if(ageElement.age == "below 16"){
                    firstRangeCount = ageElement.personas
                }else if(ageElement.age == "17 - 28"){
                    secondRangeCount = ageElement.personas
                }else if(ageElement.age == "28 - 45"){
                    thirdRangeCount = ageElement.personas
                }else if(ageElement.age == "45+"){
                    forthRangeCount = ageElement.personas
                }
            });
            todayAgeRagngeData = {
                first_range_count: firstRangeCount,
                second_range_count: secondRangeCount,
                third_range_count: thirdRangeCount,
                forth_range_count: forthRangeCount
            }
        }

        data['todayAgeRagngeData'] = todayAgeRagngeData
    
        let stateData = {}; // Initialize as an empty object
        let cityData = {};  // Initialize as an empty object
        
        const stateTodayDistribution = await UserModel.getStateWiseLocationDistributionData(startDate, endDate);
        const cityTodayDistribution = await UserModel.getCityWiseLocationDistributionData(startDate, endDate);
        
        if (stateTodayDistribution?.length > 0) {
            stateTodayDistribution.forEach((element) => {
                if (element.state !== "Other") {
                    if (!stateData[element.state]) {
                        stateData[element.state] = {}; // Initialize as an empty object
                    }
                    stateData[element.state]['stateTodayDistribution'] = element.count;
                }
            });
        }
        
        if (cityTodayDistribution?.length > 0) {
            cityTodayDistribution.forEach((element) => {
                if (element.city !== "Other") {
                    if (!cityData[element.city]) {
                        cityData[element.city] = {}; // Initialize as an empty object
                    }
                    cityData[element.city]['cityTodayDistribution'] = element.count;
                }
            });
        }

        data['stateDistribution'] = stateData
        data['cityDistribution'] = cityData

        //get the chart data age wise
        const todayRevenueData = await InvoiceModel.revenueData(startDate, endDate);
        data['todayRevenueData'] = todayRevenueData
       
        //get the chart data age wise
        const todayActiveUsersData = await UserMobileActivityModel.getUserEngagementByDay(startDate, endDate);
        data['todayActiveUsersData'] = todayActiveUsersData
    
        //get the sessionData
        const todaySessionDurationsData = await UserMobileActivityModel.getSessionDuration(startDate, endDate);
        data['todaySessionDurationsData'] = await millisecToTime(todaySessionDurationsData)
        const date = moment().format('MMMM D, YYYY, h:mm A');

        data['date'] = date

        //get the sessionData
        const todayWatchingVideo= await CourseWatchHistoryModel.continueWatchingVideoCount(startDate, endDate);
        const todayCompletedVideo = await CourseWatchHistoryModel.completedVideoCount(startDate, endDate);

        let todayWatchVideo = todayWatchingVideo + todayCompletedVideo
    
        data['todayWatchVideo'] = todayWatchVideo
        data['todayCompletedVideo'] = todayWatchVideo && todayCompletedVideo ? parseFloat(todayCompletedVideo * 100 / todayWatchVideo).toFixed(2) : 0
       
        let subject = "Daily Snapshot";
        let message = await dailySnapshot(data);
        sendMail("tjcloudtest@gmail.com", message, subject, '', "Daily Snapshot");

        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Mail send successfully"
        }

    }catch (error) {
        // Handle unexpected errors
       // console.log("error :: ", error)
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to send mail successfully',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }  
}

//add user data
const sendWeeklyReportMail = async () => {
    try{
        let data = {}
        //yesterday signup user
        let startSevenDate = new Date(new Date(moment(new Date()).subtract(7, 'days').format("YYYY-MM-DD")).setUTCHours(0, 0, 0, 0)).toISOString()
        let endSevenDate = new Date(new Date(moment(new Date()).subtract(1, 'days').format("YYYY-MM-DD")).setUTCHours(23, 59, 59, 999)).toISOString()

        let lastSevrnDaySignup = await UserModel.countStudents( "", "", startSevenDate, endSevenDate)
        data['lastSevrnDaySignup'] = lastSevrnDaySignup

        let lastSevrnDayReferral = await UserModel.countStudents( "", "", startSevenDate, endSevenDate, 1)
        data['lastSevrnDayReferral'] = lastSevrnDayReferral
       
        //get the chart data age wise
        const lastSevrnDayAgeData = await UserModel.dailyReportAgeData(startSevenDate, endSevenDate);
        data['lastSevrnDayAgeData'] = lastSevrnDayAgeData
    
        let firstRangeCount = 0;
        let secondRangeCount = 0;
        let thirdRangeCount = 0;
        let forthRangeCount = 0;
        
        let lastSevrnDayAgeRagngeData = {
            first_range_count: firstRangeCount,
            second_range_count: secondRangeCount,
            third_range_count: thirdRangeCount,
            forth_range_count: forthRangeCount
        }


        if(lastSevrnDayAgeData && lastSevrnDayAgeData?.length > 0){
            lastSevrnDayAgeData.map((ageElement) => {
                if(ageElement.age == "below 16"){
                    firstRangeCount = ageElement.personas
                }else if(ageElement.age == "17 - 28"){
                    secondRangeCount = ageElement.personas
                }else if(ageElement.age == "28 - 45"){
                    thirdRangeCount = ageElement.personas
                }else if(ageElement.age == "45+"){
                    forthRangeCount = ageElement.personas
                }
            });
            lastSevrnDayAgeRagngeData = {
                first_range_count: firstRangeCount,
                second_range_count: secondRangeCount,
                third_range_count: thirdRangeCount,
                forth_range_count: forthRangeCount
            }
        }
        data['lastSevrnDayAgeRagngeData'] = lastSevrnDayAgeRagngeData

        let stateData = {}; // Initialize as an empty object
        let cityData = {};  // Initialize as an empty object
        
        const stateLastSevrnDayDistribution = await UserModel.getStateWiseLocationDistributionData(startSevenDate, endSevenDate);
        const cityLastSevrnDayDistribution = await UserModel.getCityWiseLocationDistributionData(startSevenDate, endSevenDate);
        
        if (stateLastSevrnDayDistribution?.length > 0) {
            stateLastSevrnDayDistribution.forEach((element) => {
                if (element.state !== "Other") {
                    if (!stateData[element.state]) {
                        stateData[element.state] = {}; // Initialize as an empty object
                    }
                    stateData[element.state]['stateLastSevrnDayDistribution'] = element.count;
                }
            });
        }
        
        if (cityLastSevrnDayDistribution?.length > 0) {
            cityLastSevrnDayDistribution.forEach((element) => {
                if (element.city !== "Other") {
                    if (!cityData[element.city]) {
                        cityData[element.city] = {}; // Initialize as an empty object
                    }
                    cityData[element.city]['cityLastSevrnDayDistribution'] = element.count;
                }
            });
        }

        data['stateDistribution'] = stateData
        data['cityDistribution'] = cityData

        //get the chart data age wise
        const lastSevrnDayRevenueData = await InvoiceModel.revenueData(startSevenDate, endSevenDate);
        data['lastSevrnDayRevenueData'] = lastSevrnDayRevenueData

        //get the chart data age wise
        const lastSevrnDayActiveUsersData = await UserMobileActivityModel.getUserEngagementByDay(startSevenDate, endSevenDate);
        data['lastSevrnDayActiveUsersData'] = lastSevrnDayActiveUsersData
      
        //get the sessionData
        const lastSevrnDaySessionDurationsData = await UserMobileActivityModel.getSessionDuration(startSevenDate, endSevenDate);
        data['lastSevrnDaySessionDurationsData'] = await millisecToTime(lastSevrnDaySessionDurationsData)
       
        const date = moment().format('MMMM D, YYYY, h:mm A');

        data['date'] = date

        //get the sessionData
        const lastSevrnDayWatchingVideo = await CourseWatchHistoryModel.continueWatchingVideoCount(startSevenDate, endSevenDate);
        const lastSevrnDayCompletedVideo = await CourseWatchHistoryModel.completedVideoCount(startSevenDate, endSevenDate);

        let lastSevrnDayWatchVideo = lastSevrnDayWatchingVideo + lastSevrnDayCompletedVideo
        data['lastSevrnDayWatchVideo'] = lastSevrnDayWatchVideo
        data['lastSevrnDayCompletedVideo'] = lastSevrnDayWatchVideo && lastSevrnDayCompletedVideo ? parseFloat(lastSevrnDayCompletedVideo * 100 / lastSevrnDayWatchVideo).toFixed(2)  : 0
       
        let subject = "Weekly Snapshot";
        let message = await weeklySnapshot(data);
        sendMail("tjcloudtest@gmail.com", message, subject, '', "Weekly Snapshot");

        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Mail send successfully"
        }

    }catch (error) {
        // Handle unexpected errors
       // console.log("error :: ", error)
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to send mail successfully',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }  
}

//add user data
const sendMonthlyReportMail = async () => {
    try{
        let data = {}

        //yesterday signup user
        let startDate = new Date(new Date(moment().startOf('month').format("YYYY-MM-DD")).setUTCHours(0, 0, 0, 0)).toISOString()
        let endDate = new Date(new Date(moment().endOf('month').format("YYYY-MM-DD")).setUTCHours(23, 59, 59, 999)).toISOString()

        let todaySignup = await UserModel.countStudents( "", "", startDate, endDate)
        data['todaySignup'] = todaySignup

        let todayReferral = await UserModel.countStudents( "", "", startDate, endDate, 1)
        data['todayReferral'] = todayReferral

        //get the chart data age wise
        const todayAgeData = await UserModel.dailyReportAgeData(startDate, endDate);
        data['todayAgeData'] = todayAgeData

        let firstRangeCount = 0;
        let secondRangeCount = 0;
        let thirdRangeCount = 0;
        let forthRangeCount = 0;
        
        let todayAgeRagngeData = {
            first_range_count: firstRangeCount,
            second_range_count: secondRangeCount,
            third_range_count: thirdRangeCount,
            forth_range_count: forthRangeCount
        }

        if(todayAgeData && todayAgeData?.length > 0){
            todayAgeData.map((ageElement) => {
                if(ageElement.age == "below 16"){
                    firstRangeCount = ageElement.personas
                }else if(ageElement.age == "17 - 28"){
                    secondRangeCount = ageElement.personas
                }else if(ageElement.age == "28 - 45"){
                    thirdRangeCount = ageElement.personas
                }else if(ageElement.age == "45+"){
                    forthRangeCount = ageElement.personas
                }
            });
            todayAgeRagngeData = {
                first_range_count: firstRangeCount,
                second_range_count: secondRangeCount,
                third_range_count: thirdRangeCount,
                forth_range_count: forthRangeCount
            }
        }

        data['todayAgeRagngeData'] = todayAgeRagngeData
      
        let stateData = {}; // Initialize as an empty object
        let cityData = {};  // Initialize as an empty object
        
        const stateTodayDistribution = await UserModel.getStateWiseLocationDistributionData(startDate, endDate);
        const cityTodayDistribution = await UserModel.getCityWiseLocationDistributionData(startDate, endDate);
        
        if (stateTodayDistribution?.length > 0) {
            stateTodayDistribution.forEach((element) => {
                if (element.state !== "Other") {
                    if (!stateData[element.state]) {
                        stateData[element.state] = {}; // Initialize as an empty object
                    }
                    stateData[element.state]['stateTodayDistribution'] = element.count;
                }
            });
        }
        
        if (cityTodayDistribution?.length > 0) {
            cityTodayDistribution.forEach((element) => {
                if (element.city !== "Other") {
                    if (!cityData[element.city]) {
                        cityData[element.city] = {}; // Initialize as an empty object
                    }
                    cityData[element.city]['cityTodayDistribution'] = element.count;
                }
            });
        }

        data['stateDistribution'] = stateData
        data['cityDistribution'] = cityData

        //get the chart data age wise
        const todayRevenueData = await InvoiceModel.revenueData(startDate, endDate);
        data['todayRevenueData'] = todayRevenueData

        //get the chart data age wise
        const todayActiveUsersData = await UserMobileActivityModel.getUserEngagementByDay(startDate, endDate);
        data['todayActiveUsersData'] = todayActiveUsersData

        //get the sessionData
        const todaySessionDurationsData = await UserMobileActivityModel.getSessionDuration(startDate, endDate);
        data['todaySessionDurationsData'] = await millisecToTime(todaySessionDurationsData)

        const date = moment().format('MMMM D, YYYY, h:mm A');

        data['date'] = date

        //get the sessionData
        const todayWatchingVideo= await CourseWatchHistoryModel.continueWatchingVideoCount(startDate, endDate);
        const todayCompletedVideo = await CourseWatchHistoryModel.completedVideoCount(startDate, endDate);

        let todayWatchVideo = todayWatchingVideo + todayCompletedVideo
        data['todayWatchVideo'] = todayWatchVideo
        data['todayCompletedVideo'] = todayWatchVideo && todayCompletedVideo ? parseFloat(todayCompletedVideo * 100 / todayWatchVideo).toFixed(2) : 0
    
        let subject = "Monthly Snapshot";
        let message = await monthlySnapshot(data);
        sendMail("tjcloudtest@gmail.com", message, subject, '', "Monthly Snapshot");

        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Mail send successfully"
        }

    }catch (error) {
        // Handle unexpected errors
       // console.log("error :: ", error)
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to send mail successfully',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        }
    }  
}

module.exports = {
    getLinkedinData,
    userSignin,
    addUser,
    sendOtp,
    verifyOtp,
    importStudents,
    getStudentsData,
    loginWithSocialAccount,
    sendForgotPasswordLink,
    changePassword,
    getStudentAccountDetail,
    updateAccountData,
    changeAccountPassword,
    changeNotificationStatus,
    changeApplicationLanguage,
    addStudent,
    changeStudentPassword,
    updateStudentData,
    deleteStudent,
    changeProfileImage,
    checkUserData,
    getAgeData,
    getGenderData,
    getLanguageData,
    getEnrollmentData,
    getMobileUsageInWeekData,
    getMobileUsageInDaysData,
    getMobileUsageInMonthData,
    getLoginHistoryInWeekData,
    getLoginHistoryInDaysData,
    getLoginHistoryInMonthData,
    getRegistrationHistoryInWeekData,
    getRegistrationHistoryInDaysData,
    getRegistrationHistoryInMonthData,
    getCourseEnrollmentDataCourseWise,
    getCourseCompletionRateCourseWise,
    getRegistrationRateInWeekData,
    getRegistrationRateInDaysData,
    getRegistrationRateInMonthData,
    getCourseEnrollmentRateInWeekData,
    getCourseEnrollmentRateInDaysData,
    getCourseEnrollmentRateInMonthData,
    getLoginFrequencyData,
    getCourseEnrollmentPercentageInWeekData,
    getCourseCompletionRateData,
    getAllStudent,
    resetProfileImage,
    checkMobileNo,
    verifyMobileOtp,
    getStateWiseLocationDistributionData,
    getCityWiseLocationDistributionData,
    getSignupDistribution,
    getOSUsage,
    userBase,
    userEngagement,
    saveEmailLogs,
    getStudentsByIds,
    getStudentsCount,
    testNotification,
    assignReferralCode,
    sendDailyReportMail,
    cityDropdown,
    stateDropdown,
    studentData,
    changeHemanStatus,
    getStudentById,
    userReferral,
    getCouponUserList,
    quickSignup,
    sendWeeklyReportMail,
    sendMonthlyReportMail
}