const { UserCourseModel, CourseWatchHistoryModel, UserModel, InvoiceModel, CartModel } = require("../database");
const constants = require('../utils/constant');
const { createSubscription , cancelSubscription } = require('../utils/paymentManagement');
const { CallCourseQueryEvent,CallCourseQueryDataEvent, CallCourseEvents, CallEventBus } = require('../utils/call-event-bus');
const { coursePurchaseTemplate, subscriptionCancelTemplate } = require('../utils/email-template');
const { createCronLogs, updateCronLogs, createApiCallLog, getNewDate, sendMail, generatePDF, sendPushNotification, findUniqueID } = require('../utils');
const { encrypt, decrypt } = require('../utils/ccavenue');
const moment = require('moment');
const fs = require('fs');
const qs = require('querystring');
const { invoiceTemplate } = require('../utils/pdf-template');

const assignCourse = async (userInputs,request) => {
    try{
        const { user_id, course_id, duration, duration_time  } = userInputs;
        //get course data
        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id, course_id});
        let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: course_id  }, request.get("Authorization"))

        if(courseData){
            if(courseData?.status !== 1 || courseData?.is_pause_enrollment === true){
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to assign course"
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to assign course"
            };
        }

        // Create a new date object
        const date = await getNewDate(duration, duration_time); // Please make sure getNewDate is an asynchronous function

        if(getFilterData == null || (getFilterData.type !== 1 && (getFilterData.course_subscription_type == 3 || (getFilterData.course_subscription_type == 4) && (getFilterData.payment_status !== 2 || getFilterData.is_expired == true)))){
            //delete the course if not do the payment
            await UserCourseModel.deleteAssignCourse(user_id,course_id)

            const createUserCourse = await UserCourseModel.assignUserCourse({ 
                user_id: user_id, 
                course_id: course_id, 
                duration: duration, 
                duration_time: duration_time,
                type: 1,
                purchase_date: new Date(),
                course_subscription_type: courseData ? courseData.course_subscription_type : '',
                expire_date: date
            });

            UserModel.updateUser(user_id,{ 
                is_purchase_course: true
            });

            if(createUserCourse !== false){
                const getUserData = await UserModel.fatchUserById(user_id);
                let subject = `Course Assiged - ${courseData.course_title}`;
                let message = await coursePurchaseTemplate({ user_name: `${getUserData?.first_name} ${getUserData?.last_name}`, subject: subject, course_title: courseData.course_title});
                let sendwait = sendMail(getUserData?.email, message, subject, user_id, "Course Assign")

                let id= createUserCourse?._id ? createUserCourse?._id : null;

                let data = {
                    module: "course",
                    reference_id: id
                }

                if(getUserData?.notification_device_id){
                    if(getUserData?.operating_system == "ios" || getUserData?.operating_system == "android" ){
                        sendPushNotification({notification_device_id:[getUserData?.notification_device_id], message: "Course has been purchased successfully.", template_id: "20a140f6-66bb-4995-94af-0a58632afd31", data, device_type: getUserData?.operating_system})
                    }
                }

                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course assign successfully",
                    id: createUserCourse._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to assign course",
                    id: null
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Course is already assign to the user",
                error: {
                    course_title: "Course is already assign to the user"
                }
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in assignCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to assign course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}
 
const getAssignCourseList = async (userInputs,request) => {
    try{
        const { user_id, startToken, endToken, course_subscription_type } = userInputs;

        const perPage = parseInt(endToken) || 10; 
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) { 
            page = perPage * page; 
        }


        //get course data
        const getUserCourse = await UserCourseModel.getUserCourseData({ user_id,  page, perPage, course_subscription_type });
        const countUserCourse = await UserCourseModel.getUserCourseCount({ user_id, course_subscription_type });

        if(getUserCourse){
            
            let cartData = [];
            if(getUserCourse.length > 0){
            
                let promiseCartData = await new Promise(async (resolve, reject) => {
                    let keyCount = 0
                    await getUserCourse.map(async (cartElement, cartKey) => {
                        await new Promise(async (resolve, reject) => {
                            let validCourse = true
                            if(cartElement.type !== 1 && ((cartElement.course_subscription_type == 3 || cartElement.course_subscription_type == 4) && (cartElement.payment_status !== 2 || cartElement.is_expired == true))){
                                validCourse = false
                            }

                            if(validCourse){
                                let course = await CallCourseQueryEvent("get_course_data_without_auth",{ id: cartElement.course_id  }, request.get("Authorization"))
                                let courseWatchHistory = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, cartElement.course_id)
                                
                                let perForCompletedChapter = 0;
                                if(courseWatchHistory){
                                    let courseChapterCount = await CallCourseQueryDataEvent("get_chapter_count",{ course_id: cartElement.course_id  }, request.get("Authorization"));
                                    if(courseChapterCount.total_chapter > 0 && courseWatchHistory.completed_chapter.length > 0){
                                        perForCompletedChapter = courseWatchHistory.completed_chapter.length * 100 / parseInt(courseChapterCount.total_chapter);
                                    }
                                }
            
                                if(course){
                                    await cartData.push({
                                        _id: cartElement.id,
                                        user_id: cartElement.user_id,
                                        course_id: cartElement.course_id,
                                        duration: cartElement.duration,
                                        duration_time: cartElement.duration_time,
                                        createdAt: cartElement.createdAt,
                                        type: cartElement.type,
                                        course_subscription_type: cartElement.course_subscription_type,
                                        purchase_date: cartElement.purchase_date,
                                        price: cartElement.price,
                                        payment_method: cartElement.payment_method,
                                        transaction_id: cartElement.transaction_id,
                                        subscription_start_date: cartElement.subscription_start_date,
                                        subscription_end_date: cartElement.subscription_end_date,
                                        course_title: course ? course.course_title : '',
                                        per_completed_chapter: parseInt(perForCompletedChapter),
                                    })
                                    resolve(true)
                                    keyCount = keyCount + 1
                                }else{
                                    resolve(false)
                                    keyCount = keyCount + 1
                                }
                            }else{
                                resolve(false) 
                                keyCount = keyCount + 1
                            }
                        })
                
                        if (getUserCourse.length === keyCount ) {
                            resolve({
                                status: true,
                                status_code: constants.SUCCESS_RESPONSE,
                                message: "Data get successfully",
                                data: cartData,
                                record_count: countUserCourse
                            })
                        }
                    });
                });

                return promiseCartData;
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data get successfully",
                    data: cartData,
                    record_count: countUserCourse
                }
            }
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
        console.error('Error in getAssignCourseList:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const deleteUserCourse = async (userInputs) => {
    try{
        const { id } = userInputs;

        const updateUser = await UserCourseModel.updateUserCourse(id,{ 
            is_deleted: true
        }); 

        if(updateUser){
            const getFilterData = await UserCourseModel.filterUserCourseData({ id });
            
            if(getFilterData){
                CourseWatchHistoryModel.removeCourseViewHistoryData(getFilterData.user_id,getFilterData.course_id)
            }
            
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Course deleted successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to delete course"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in deleteUserCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to delete course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
    
}

const updateAssignCourse = async (userInputs,request) => {
    try{
        const { id, user_id, user_title, course_id, allowed_enrollment, duration, duration_time  } = userInputs;

        //check duplicate user name
        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id, course_id});


        if(getFilterData !== null && id !== getFilterData._id.toString()){
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Course is already assign to the user",
            };
        }else{

            const createUserCourse = await UserCourseModel.updateUserCourse(id,{ 
            user_id: user_id, 
            user_title: user_title, 
            course_id: course_id, 
            allowed_enrollment: allowed_enrollment, 
            duration: duration, 
            duration_time: duration_time
            });
            
            if(createUserCourse !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course assign successfully",
                    id: createUserCourse._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to assign course",
                    id: null
                };
            }
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in updateAssignCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to assign course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const getAssignCourseById = async (userInputs,request) => {
    try{
        const { id } = userInputs;

        const getFilterData = await UserCourseModel.filterUserCourseData({ id });

        if(getFilterData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: getFilterData
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
        console.error('Error in getAssignCourseById:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}
 
const purchaseCourse = async (userInputs,request) => {
    try{
        const { user_id, course_id, subscription_type, coupon_code } = userInputs;

        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id, course_id});

        if(getFilterData){
            if(getFilterData.type == 1){
                // course already assign to user
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Course is already assign",
                    error: {
                        course_title: "Course is already assign"
                    }
                };
            }else{
                // course already purchased by user
                if(getFilterData.type == 2 && getFilterData.payment_status == 2 && getFilterData.is_cancle_subscription == false){
                    return {
                        status: false,
                        status_code: constants.ERROR_RESPONSE,
                        message: "Course is already purchased",
                        error: {
                            course_title: "Course is already purchased"
                        }
                    };
                }
            }
        }

        let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: course_id  }, request.get("Authorization"))
        if(courseData){
            if(courseData?.status !== 1 || courseData?.is_pause_enrollment === true){
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Sorry! Failed to purchase the course."
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Sorry! Failed to purchase the course."
            };
        }

        let cronLogData = {}
        let cronstartTime = Date.now()
        //create cron log
        let cronData = await createCronLogs({
            type: "purchasecourse",
            request: JSON.stringify(request.body),
            header: request.get("Authorization"),
            response: null,
            url: "user/purchaseCourse",
            start_time: new Date()
        })
        let cronId = cronData?.status ? cronData?.cron_id : ''

        cronLogData['course_data'] = courseData

        let courseInsertData = { 
            user_id: user_id, 
            course_id: course_id, 
            type: 2,
            purchase_date: new Date(),
            course_subscription_type: courseData.course_subscription_type,
            is_tax_inclusive: courseData?.is_tax_inclusive || true,
            is_tax_exclusive: courseData?.is_tax_exclusive || false,
            tax_percentage: courseData?.tax_percentage || 0
        }

        let invoiceData = {
            user_id: user_id, 
            course_id: course_id,
            course_type: courseData.course_subscription_type
        }
        const getUserData = await UserModel.fatchUserById(user_id);
        const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: user_id});

        cronLogData['user_data'] = courseData

        let orderId = ''
        let paymentUrl = ''
        if(courseData.course_subscription_type == 4){

            if(subscription_type){

                cronLogData['user_data'] = getFilterData
                
                if(getFilterData?.course_subscription_type == 4 && getFilterData?.is_purchase == false && getFilterData?.duration == subscription_type){
                    let currentTime = Math.floor(new Date().getTime() / 1000)
                    const expireAt = Math.floor(new Date(getFilterData?.linkexpired_at).getTime() / 1000)

                    if(expireAt > currentTime){
                        cronLogData['subscribe_with'] = "old link"

                        //update cron log
                        await updateCronLogs(cronId,{
                            end_time: new Date(),
                            details: JSON.stringify(cronLogData),
                            cronstart_time: cronstartTime
                        })
    
                        return {
                            status: true,
                            status_code: constants.SUCCESS_RESPONSE,
                            message: 'Please make a payment',
                            id: getFilterData._id,
                            payment_url: getFilterData.subscription_link
                        };
                    }
                    
                }

                cronLogData['subscribe_with'] = "new link"
                //subscription payment
                let coursePlanData = await CallCourseEvents("get_course_plan_data",{ id: course_id, subscription_type }, request.get("Authorization"))

                cronLogData['course_plan_data'] = courseData

                if(coursePlanData && coursePlanData?.plan_id) {
                    

                    const expireBy = Math.floor(new Date(await getNewDate("month", 6)).getTime() / 1000)

                    //reference_id, notify_by_email,  notify_by_mobil
                    let subscriptionData ={
                        razorPayPlanId: coursePlanData?.plan_id,
                        customer_notify: 1, 
                        total_count: 1200,
                        reference_id: "",
                        expire_by: expireBy,
                        notify_by_email: getUserData?.mobile_no || null,
                        notify_by_mobil: getUserData?.email || null
                    }

                    let courseSubscription = await createSubscription(subscriptionData)

                    //create a api call
                    await createApiCallLog({
                        cron_id: cronId,
                        type: "createsubscription",
                        request: JSON.stringify(subscriptionData),
                        header: request.get("Authorization"),
                        response: JSON.stringify(courseSubscription),
                        url: "user/purchaseCourse" ,
                        details: JSON.stringify(subscriptionData),
                        execution_time: new Date()
                    })

                    if(courseSubscription?.status){
                        //payment url
                        paymentUrl = courseSubscription?.data?.short_url

                        //user course Data
                        courseInsertData['duration'] = subscription_type
                        courseInsertData['price'] = coursePlanData?.amount
                        courseInsertData['plan_id'] = coursePlanData?.plan_id
                        //courseInsertData['payment_method'] = "razorpay"
                        courseInsertData['payment_method'] = "ccavenue"
                        courseInsertData['subscription_start_date'] = new Date()
                        courseInsertData['subscription_date'] = new Date()
                        courseInsertData['linkexpired_at'] = await getNewDate("month", 6)
                        courseInsertData['amount'] = coursePlanData?.price || 0,
                        courseInsertData['discount_amount'] = coursePlanData?.discount_amount || 0,
                        courseInsertData['discount'] = coursePlanData?.discount || 0

                        if(subscription_type == 'month'){
                            // Create a new date object
                            const date = await getNewDate("month", 1)

                            courseInsertData['duration_time'] = 1
                            courseInsertData['subscription_recurring_date'] = date
                        }else if(subscription_type == 'quarter'){
                            // Create a new date object
                            const date = await getNewDate("month", 3)

                            courseInsertData['duration_time'] = 3
                            courseInsertData['subscription_recurring_date'] = date
                        }else if(subscription_type == 'year'){
                            // Create a new date object
                            const date = await getNewDate("year", 1)

                            courseInsertData['duration_time'] = 1
                            courseInsertData['subscription_recurring_date'] = date
                        }else if(subscription_type == "two-year"){
                             // Create a new date object
                             const date = await getNewDate("year", 2)

                             courseInsertData['duration_time'] = 1
                             courseInsertData['subscription_recurring_date'] = date
                        }
                        courseInsertData['subscription_id'] = courseSubscription?.data?.id
                        courseInsertData['subscription_link'] = paymentUrl

                    }else{
                        return {
                            status: false,
                            status_code: constants.EXCEPTION_ERROR_CODE,
                            message: 'Sorry! Failed to subscribe the course.',
                            data: null,
                        };
                    }
                }else{
                    return {
                        status: false,
                        status_code: constants.EXCEPTION_ERROR_CODE,
                        message: 'Sorry! Failed to subscribe the course.',
                        data: null,
                    };
                }
            }else{
                return {
                    status: false,
                    status_code: constants.EXCEPTION_ERROR_CODE,
                    message: 'Please select a subscription',
                    data: null,
                };
            }
        }else if(courseData.course_subscription_type == 3){
            //single time payment

            let courseAmount = courseData.discount_amount
            let taxAmount = 0
            let finalAmount = 0
            if(courseData?.is_tax_exclusive){
                taxAmount = parseInt(courseAmount) * parseFloat(courseData.tax_percentage) / 100 
                finalAmount = courseAmount + taxAmount
            }

            let convinceFeeAmount = 0
            if(courseData?.convince_fee){
                convinceFeeAmount = parseInt(courseAmount) * parseFloat(courseData.convince_fee) / 100 
                finalAmount = finalAmount + convinceFeeAmount
            }
            
            let hemanDiscount = 0
            if(getUserData && getUserData?.referral_code && getUserCourseData && getUserCourseData?.length == 0){
                let hemanData = await CallEventBus("get_heman_by_code",{ referral_code: getUserData.referral_code }, request.get("Authorization"))

                if(hemanData.parent_heman_id){
                    let parentHemanData = await CallEventBus("get_heman_by_id",{ id: hemanData.parent_heman_id }, request.get("Authorization"))
                    if(parentHemanData?.student_discount){ 
                        let studentDiscount = parentHemanData?.student_discount ? parentHemanData.student_discount  : 0
                        if(parentHemanData.student_discount_type == 1){
                            hemanDiscount = studentDiscount
                            finalAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                        }else if(parentHemanData.student_discount_type == 2){
                            let discount = parseInt(finalAmount) * parseFloat(studentDiscount) / 100 
                            hemanDiscount = discount
                            finalAmount = parseInt(finalAmount) - parseInt(discount)
                        }

                        // decrease the course amount
                        let coursePrice =  courseData.discount_amount

                        // calculate the heman commssion
                        let subHemanAmount = 0
                        if(parentHemanData?.sub_heman_commission){
                            if(parentHemanData.sub_heman_commission_type == 1){
                                subHemanAmount = parentHemanData.sub_heman_commission
                            }else if(parentHemanData.sub_heman_commission_type == 2){
                                let hemanCommission = parseInt(coursePrice) * parseFloat(parentHemanData.sub_heman_commission) / 100 
                                subHemanAmount = hemanCommission
                            }
                        }

                        // calculate the heman commssion
                        let hemanAmount = 0
                        if(parentHemanData?.admin_heman_commission){
                            if(parentHemanData.admin_heman_commission_type == 1){
                                hemanAmount = parentHemanData.admin_heman_commission
                            }else if(parentHemanData.admin_heman_commission_type == 2){
                            let hemanCommission = parseInt(coursePrice) * parseFloat(parentHemanData.admin_heman_commission) / 100 
                            hemanAmount = hemanCommission
                            }
                        }
                        
                        let hemanuser = {
                            user_id: user_id,
                            course_id: course_id,
                            assign_at: new Date(),
                            course_amount: courseAmount,
                            course_tax_amount: finalAmount,
                            code: getUserData.referral_code,
                            heman_id: hemanData.parent_heman_id ,
                            sub_heman_id: hemanData._id,
                            heman_amount: hemanAmount,
                            sub_heman_amount: subHemanAmount,
                            user_discount: hemanDiscount
                        } 
                        subHemanAmount = subHemanAmount  + (hemanData.amount || 0)
                        hemanAmount = hemanAmount  + (parentHemanData.amount || 0)

                        CallEventBus("add_heman_user",{ heman_id: hemanData._id,sub_heman_id: parentHemanData._id, user: hemanuser, heman_amount: hemanAmount, sub_heman_amount: subHemanAmount }, request.get("Authorization"))
                    }
                }else{
                    if(hemanData?.student_discount){ 
                        let studentDiscount = hemanData?.student_discount ? hemanData.student_discount  : 0
                        if(hemanData.student_discount_type == 1){
                            hemanDiscount = studentDiscount
                            finalAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                        }else if(hemanData.student_discount_type == 2){
                            let discount = parseInt(finalAmount) * parseFloat(studentDiscount) / 100 
                            hemanDiscount = discount
                            finalAmount = parseInt(finalAmount) - parseInt(discount)
                        }

                        // decrease the course amount
                        let coursePrice =  courseData.discount_amount
                
                        // calculate the heman commssion
                        let hemanAmount = 0
                        if(hemanData?.heman_commission){
                            if(hemanData.heman_commission_type == 1){
                                hemanAmount = hemanData.heman_commission
                            }else if(hemanData.heman_commission_type == 2){
                                let hemanCommission = parseInt(coursePrice) * parseFloat(hemanData.heman_commission) / 100 
                                hemanAmount = hemanCommission
                            }
                        }
                        
                        let hemanuser = {
                            user_id: user_id,
                            course_id: course_id,
                            assign_at: new Date(),
                            course_amount: courseAmount,
                            course_tax_amount: finalAmount,
                            code: getUserData.referral_code,
                            heman_id: hemanData._id,
                            sub_heman_id: null,
                            heman_amount: hemanAmount,
                            sub_heman_amount: 0,
                            user_discount: hemanDiscount
                        } 
                        hemanAmount = hemanAmount  + (hemanData.amount || 0)

                        CallEventBus("add_heman_user",{ heman_id: hemanData._id,sub_heman_id: null, user: hemanuser, heman_amount: hemanAmount, sub_heman_amount: 0 }, request.get("Authorization"))
                    }
                }
            }

            let couponAmount = 0
            if(coupon_code){
                let couponData = await CallEventBus("get_coupon_data",{ coupon_code: coupon_code }, request.get("Authorization"))

                if(couponData){
                    if(couponData.discount_type == 1){
                        couponAmount = couponData.discount
                        amount = parseInt(finalAmount) - parseInt(couponAmount)
                    }else if(hemanData.discount_type == 2){
                        let discount = parseInt(courseAmount) * parseFloat(couponData.discount) / 100 
                        couponAmount = discount
                        amount = parseInt(finalAmount) - parseInt(discount)
                    }
                    //add the coupon history
                    await CallEventBus("add_coupon_used_data",{ coupon_id: couponData._id, user_id: user_id, amount: couponAmount,coupon_code: coupon_code, course_id: course_id }, request.get("Authorization"))
                }
            }
        
            courseInsertData['price'] = finalAmount
            courseInsertData['is_lifetime_access'] = courseData?.is_lifetimefree || false
            //courseInsertData['payment_method'] = "razorpay",
            courseInsertData['payment_method'] = "ccavenue",
            courseInsertData['amount'] = courseData?.price || 0,
            courseInsertData['discount_amount'] = courseData?.discount_amount || 0,
            courseInsertData['tax_amount'] = taxAmount
            courseInsertData['heman_discount_amount'] = hemanDiscount
            courseInsertData['convince_fee'] = courseData?.convince_fee || 0
            courseInsertData['convince_fee_amount'] = convinceFeeAmount
            
            if(courseData?.is_limitedtime  && courseData?.is_limitedtime == true){

                // Create a new date object
                const date = await getNewDate(courseData?.interval_time, courseData?.interval_count)

                courseInsertData['duration'] = courseData?.interval_time ? courseData?.interval_time : null
                courseInsertData['duration_time'] = courseData?.interval_count ? courseData?.interval_count : null
                courseInsertData['expire_date'] = date
            }

            let amount = finalAmount
            if(amount > 0){
                invoiceData['amount'] = amount

                let workingKey = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_KEY_TESTING : process.env.CCAVENUE_KEY
                let accessCode = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_ACCESS_CODE_TESTING : process.env.CCAVENUE_ACCESS_CODE
                paymentUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_URL_TESTING : process.env.CCAVENUE_URL
                let merchant_id = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_MID_TESTING : process.env.CCAVENUE_MID
                let redirectUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_REDIRECT_URL_TESTING : process.env.CCAVENUE_REDIRECT_URL
                orderId = await findUniqueID()
                let paymentData = {
                    merchant_id: merchant_id,
                    order_id: orderId,
                    currency: "INR",
                    amount: amount,
                    language: "EN",
                    billing_name: (getUserData?.first_name ? getUserData?.first_name : '') + " " + (getUserData?.last_name ? getUserData?.last_name : ''),
                    billing_address:  'Santacruz', 
                    billing_city: getUserData?.city || 'Rajkot',
                    billing_state: getUserData?.state || 'Gujrat',
                    billing_zip: getUserData?.pincode || '400054',
                    billing_country: getUserData?.country || 'India',
                    billing_tel: getUserData?.mobile_no || '9512742802',
                    billing_email: getUserData?.email || 'demouser@gmail.com',
                    merchant_param1: user_id,
                    integration_type: "iframe_normal",
                    redirect_url: redirectUrl,
                    cancel_url: redirectUrl
                }
        
                const stringified = qs.stringify(paymentData);
                let encRequest = encrypt(stringified, workingKey)
        
                paymentUrl = paymentUrl + "command=initiateTransaction&merchant_id="+merchant_id+"&encRequest="+encRequest+"&access_code="+accessCode
            
                cronLogData['payment_url'] = paymentUrl

                invoiceData['order_id'] = orderId
                invoiceData['purchase_time'] = new Date()
                invoiceData['invoice_type'] = 2
                invoiceData['module_name'] = "Subscription/Payment";
                const createInvoice = await InvoiceModel.createInvoice(invoiceData);
        
                cronLogData['create_invoice'] = createInvoice

                courseInsertData['invoice_id'] = createInvoice?._id ? createInvoice?._id.toString() : null
                    
               
            }else{
                return {
                    status: false,
                    status_code: constants.EXCEPTION_ERROR_CODE,
                    message: 'Sorry! Failed to purchase the course.',
                    data: null,
                };
            } 
        }

        const createUserCourse = await UserCourseModel.assignUserCourse(courseInsertData);
        cronLogData['create_user_course'] = courseData

        UserModel.updateUser(user_id,{ 
            is_purchase_course: true
        });

        //update cron log
        await updateCronLogs(cronId,{
            end_time: new Date(),
            details: JSON.stringify(cronLogData),
            cronstart_time: cronstartTime
        })
        
        if(createUserCourse !== false){

            let id= createUserCourse?._id ? createUserCourse?._id : null;
            if(request?.user?.notification_device_id){
                let data = {
                    module: "course",
                    reference_id: id
                }

                await sendPushNotification({notification_device_id:[request.user.notification_device_id], message: "Course has been purchased successfully.", data, device_type: "android"})
            }
            
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Course purchase successfully",
                id: id,
                order_id: orderId,
                payment_url: paymentUrl
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to purchase course",
                id: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in purchaseCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to purchase course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const mylearning = async (userInputs,request) => {
    try{
        const { user_id, page_type } = userInputs; 

        //check duplicate user name
        const getUserCourse = await UserCourseModel.getUserCourseLearningData({ user_id,  page_type });

        if(getUserCourse){
            
            let courseData = [];
            let courseid = [];
            if(getUserCourse.length > 0){
                let promisecourseData = await new Promise(async (resolve, reject) => {
                    let keyCount = 0
                    let courseDataKey = 0
                    await getUserCourse.map(async (courseElement, courseKey) => {
                        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id, course_id: courseElement.course_id});

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
                        
                        if(!courseid.includes(courseElement.course_id) && isPurchase){
                            courseid.push(courseElement.course_id)
                            //await new Promise(async (resolve, reject) => {
                                let course = await CallCourseQueryEvent("get_course_data_without_auth",{ id: courseElement.course_id  }, request.get("Authorization"))
                                let courseWatchHistory = await CourseWatchHistoryModel.filterCourseWatchHistoryData(user_id, courseElement.course_id)
                                let courseDefault = await CallCourseQueryEvent("get_course_default_promotional_content",{ course_id: courseElement.course_id  }, request.get("Authorization"))

                                let courseChapterCount = await CallCourseQueryDataEvent("get_chapter_count",{ course_id: courseElement.course_id  }, request.get("Authorization"));

                                let perForCompletedChapter = 0;
                                let completedChapterCount = 0;
                                if(courseWatchHistory){
                                    if(courseChapterCount.total_chapter > 0 && courseWatchHistory.completed_chapter.length > 0){
                                        completedChapterCount = courseWatchHistory.completed_chapter.length
                                        perForCompletedChapter = courseWatchHistory.completed_chapter.length * 100 / parseInt(courseChapterCount.total_chapter);
                                    } 
                                }
            
                                if(course && ((page_type == 1) || (page_type == 2 && ((courseWatchHistory && courseWatchHistory.is_course_completed == false) || (courseWatchHistory == null))) || (page_type == 3 && courseWatchHistory && courseWatchHistory.is_course_completed == true) )){
                                    courseData[courseDataKey] = {
                                        _id: courseElement.id,
                                        user_id: courseElement.user_id,
                                        course_id: courseElement.course_id,
                                        duration: courseElement.duration,
                                        duration_time: courseElement.duration_time,
                                        createdAt: courseElement.createdAt,
                                        type: courseElement.type,
                                        course_subscription_type: courseElement.course_subscription_type,
                                        purchase_date: courseElement.purchase_date,
                                        price: courseElement.price,
                                        payment_method: courseElement.payment_method,
                                        transaction_id: courseElement.transaction_id,
                                        subscription_start_date: courseElement.subscription_start_date,
                                        subscription_end_date: courseElement?.subscription_end_date || null,
                                        course_chapter_count: courseChapterCount?.total_chapter || 0,
                                        course_topic_count: courseChapterCount?.total_topic || 0,
                                        completed_chapter_count: completedChapterCount,
                                        course: {
                                            course_title: course?.course_title ? course.course_title : '',
                                            course_description: course?.short_description ? course.short_description : '',
                                            image: courseDefault?.web_image ? courseDefault.web_image : '',
                                            publisher_id: course?.publisher_id ? course.publisher_id : '',
                                            publisher_name: course?.publisher_name ? course.publisher_name : '',
                                        },
                                        per_completed_chapter: parseInt(perForCompletedChapter),
                                    }
                                    //resolve(true)
                                    courseDataKey = courseDataKey + 1
                                    keyCount = keyCount + 1
                                }else{
                                // resolve(false)
                                    
                                    keyCount = keyCount + 1
                                }
                            //})
                        }else{
                            keyCount = keyCount + 1
                        }
                
                        if (getUserCourse.length === keyCount ) {
                            resolve({
                                status: true,
                                status_code: constants.SUCCESS_RESPONSE,
                                message: "Data get successfully",
                                data: courseData
                            })
                        }
                    });
                });

                return promisecourseData;
            }else{
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Data get successfully",
                    data: courseData
                }
            }

        
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
        console.error('Error in mylearning:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const countCourseUser = async (userInputs) => {
    try{
        const { course_id } = userInputs;

        const countUser = await UserCourseModel.getUserCourseCount({ course_id });
        
        if(countUser){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: {count: countUser}
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to get count",
                data: {count: 0}
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in countCourseUser:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
    
}

const coursePaymentResponse = async (userInputs) => {
    try{
        const { order_id, payment_status, payment_response } = userInputs;

        let subScriptionData = await InvoiceModel.findOrderData(order_id)

        if(subScriptionData){
            let statusCode = 3 // for failed
            let paymentStatus = 'failed' // for failed
            let invoive_id = subScriptionData._id.toString()

            if(payment_status){
                statusCode = 2 // for success
                paymentStatus = 'paid'
                // delete all cart item
                await CartModel.removeAllCartData(subScriptionData.user_id);
            }
            //update invoice data
            await InvoiceModel.updateInvoice(subScriptionData._id, {
                payment_status: statusCode,
                payment_response: payment_response,
                payment_date: new Date()
            })

            //update user course data
            await UserCourseModel.updateUserCourseUsingInvoice(invoive_id,{
                payment_status: statusCode,
                is_send_mail: true,
                is_purchase: true
            })

            const userData = await UserModel.fatchUserById(subScriptionData.user_id);
            let userCourseData =  await UserCourseModel.getUserCourse({ invoice_id: invoive_id })

            //send a invoice mail
            if(userCourseData && userData?.email){
                let courseArray = []

                if(userCourseData.length > 0){
                    await Promise.all(
                        userCourseData.map(async (element) => {
                            let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: element?.course_id  },'')
                            await courseArray.push({
                                course_title: courseData?.course_title || "",
                                amount: element?.price || 0,
                            })
                        })
                    )
                }
                
                const pdfName = order_id+".pdf";

                await new Promise(async (resolve, reject) => {
                    const invoiceData = {
                        status: paymentStatus,
                        amount:subScriptionData.amount,
                        username: `${userData.first_name} ${userData.last_name}`,
                        issue_data: moment(new Date()).format('MMMM.Do.YYYY'),
                        due_date: moment(new Date()).format('MMMM.Do.YYYY'),
                        course: courseArray
                    };
                    const pdfBody = await invoiceTemplate(invoiceData);
                    const result = await generatePDF(pdfBody, pdfName);
                    if(result){
                        resolve(true)
                    }
                })
            
                let email = userData?.email
                let subject = `Invoice for course payment`;
            
                let filePath = 'uploads/'+pdfName;

                //send subscription invoice mail
                let sendwait = await sendMail(email, "", subject, subScriptionData.user_id, "Course Payment", true, filePath, pdfName)

                if(sendwait){
                    if (fs.existsSync('uploads/'+pdfName)) {
                        fs.unlinkSync('uploads/'+pdfName);
                    }
                }
            }
        }
        
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Payment response store successfully",
            data: null
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in coursePaymentResponse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
    
}

const checkCourseSubscription = async (userInputs,request) => {
    try{
        const { user_id, course_id } = userInputs;

        //get course data
        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id, course_id});

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

        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "User course data",
            data:{
                is_assign_course : isPurchase
            }
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in assignCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to assign course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const checkexpiredCourse = async () => {
    try{
       
       const getFilterData = await UserCourseModel.checkCourseSubscription();
       
       if(getFilterData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE
            };
       }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE
            };
       }
      
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in assignCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to assign course',
            error: { server_error: 'An unexpected error occurred' },
        };
    }
}

const getExpiringCourses = async () => {
    try{
        const getFilterData = await UserCourseModel.getExpiringSoonCourses({ expiration_days: 7 });
        getFilterData.map(async (course, courseKey) => {
            const getUserData = await UserModel.fatchUserById(course.user_id);
            let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: course?.course_id  },' ')
            //console.log('getUserData:: ',getUserData);
            //console.log('course:: ',course)
            if(getUserData && getUserData?.email && courseData){
                const expireDate = moment(course.expire_date).format('MMMM Do YYYY');
                let subject = "Tick Tock: "+courseData.course_title+" Expiring Soon";
                let message = await welcomeTemplate({ user_name: `${getUserData.first_name} ${getUserData.last_name}`, subject: subject, course_name: courseData.course_title, expireDate: expireDate});
                let sendMail = await sendMail(getUserData?.email, message, subject)
            }
        });
        if(getFilterData){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE
            };
        }
        
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in assignCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to assign course',
            error: { server_error: 'An unexpected error occurred' },
        };
    }
}

const cancelCourseSubscription = async (userInputs,request) => {
    try{
        const { user_id, course_id } = userInputs;

        let cronLogData = {}
        let cronstartTime = Date.now()
        //create cron log
        let cronData = await createCronLogs({
            type: "cancelcoursesubscription",
            request: JSON.stringify(request.body),
            header: request.get("Authorization"),
            response: null,
            url: "user/cancelCourseSubscription",
            start_time: new Date()
        })
        let cronId = cronData?.status ? cronData?.cron_id : ''

        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id, course_id});
        cronLogData['course_subscription_data'] = getFilterData

        if(getFilterData != null && getFilterData?.subscription_id && !getFilterData?.is_cancle_subscription){
            let subscriptionData = {
                subscription_id: getFilterData?.subscription_id
            }
            let cancelcourseSubscription = await cancelSubscription(subscriptionData)

            //create a api call
            await createApiCallLog({
                cron_id: cronId,
                type: "cancelcoursesubscription",
                request: JSON.stringify(subscriptionData),
                header: request.get("Authorization"),
                response: JSON.stringify(cancelcourseSubscription),
                url: "user/cancelCourseSubscription" ,
                details: JSON.stringify(subscriptionData),
                execution_time: new Date()
            })

            if(cancelcourseSubscription?.status){
                    //update SUBSCRIPRION
                    await UserCourseModel.updateUserCourse(getFilterData._id,{
                        end_time: new Date(),
                        is_cancle_subscription: true,
                        is_deleted: true
                    })

                    //update cron log
                    await updateCronLogs(cronId,{
                        end_time: new Date(),
                        details: JSON.stringify(cronLogData),
                        cronstart_time: cronstartTime
                    })

                    //send cancel mail
                    let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: course_id  }, request.get("Authorization"))
                    const getUserData = await UserModel.fatchUserById(user_id);
                    let subject = `Course Subscription Cancellation - ${courseData?.course_title}`;
                    let message = await subscriptionCancelTemplate({ user_name: `${getUserData?.first_name} ${getUserData?.last_name}`, subject: subject, course_title: courseData?.course_title});
                    await sendMail(getUserData?.email, message, subject, user_id, "Course Payment");

                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: 'Subscription canceled successfully',
                        data: null,
                    };
            }else{
                //update cron log
                await updateCronLogs(cronId,{
                    end_time: new Date(),
                    details: JSON.stringify(cronLogData),
                    cronstart_time: cronstartTime
                })
                return {
                    status: false,
                    status_code: constants.EXCEPTION_ERROR_CODE,
                    message: 'Sorry! Failed to cancel course subscription.',
                    data: null,
                };
            }
        }else{
           //update cron log
            await updateCronLogs(cronId,{
                end_time: new Date(),
                details: JSON.stringify(cronLogData),
                cronstart_time: cronstartTime
            })
            return {
                status: false,
                status_code: constants.EXCEPTION_ERROR_CODE,
                message: 'Course is not subscribe by you',
                data: null,
            }; 
        }

    }catch (error) {
        // Handle unexpected errors
        console.error('Error in purchaseCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to cancel course subscription',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const getPaymentHistory = async (userInputs,request) => {
    try{
        const { user_id, startToken, endToken, type, payment_type } = userInputs;

        const perPage = parseInt(endToken) || 10; 
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) { 
            page = perPage * page; 
        }

        //get course data
        const paymentHistory = await InvoiceModel.getPaymentHistory({ user_id,  page, perPage, type, payment_type });
        const userData = await UserModel.fatchUserById(user_id);

        if(paymentHistory?.length > 0){
            await Promise.all(
                await paymentHistory.map(async (element, key) => {
                    let invoive_id = element._id.toString()
                    let userCourseData =  await UserCourseModel.getUserCourse({ invoice_id: invoive_id })

                    let courseArray = []
                    if(userCourseData && userCourseData?.length > 0){
                        await Promise.all(
                            userCourseData.map(async (courseElement) => {
                                let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: courseElement?.course_id  },'')
                                let courseDefault = await CallCourseQueryEvent("get_course_default_promotional_content",{ course_id: courseElement?.course_id  }, request.get("Authorization"))

                                await courseArray.push({
                                    course_id: courseData.course_id,
                                    course_title: courseData?.course_title || "",
                                    thumbnail_image: courseDefault?.web_image || null,
                                    short_description: courseData?.short_description || null,
                                })
                            })
                        )
                        await paymentHistory[key].set('course_detail', courseArray?.length > 0 ? courseArray[0] : {} ,{strict:false})
                    }else if(element?.course_id){
                        let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: element?.course_id  },'')
                        let courseDefault = await CallCourseQueryEvent("get_course_default_promotional_content",{ course_id: element?.course_id  }, request.get("Authorization"))

                        await paymentHistory[key].set('course_detail',{
                            course_id: courseData.course_id,
                            course_title: courseData?.course_title || "",
                            thumbnail_image: courseDefault?.web_image || null,
                            short_description: courseData?.short_description || null,
                        } ,{strict:false})
                    }

                    await paymentHistory[key].set('username',`${userData.first_name} ${userData.last_name}` ,{strict:false})
                })
            )
        }
      
        if(paymentHistory){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: paymentHistory
            }
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
        console.error('Error in getPaymentHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const getInvoice = async (userInputs) => {
    try{
        const { invoice_id, user_id } = userInputs;

        const userData = await UserModel.fatchUserById(user_id);
        let invoiceData = await InvoiceModel.findByIdData(invoice_id)
       

        //send a invoice mail
        if(userData && invoiceData){

            let userCourseData = []
            if(invoiceData.invoice_type == 2){
                userCourseData =  await UserCourseModel.getUserCourse({ invoice_id: invoice_id })
            }else{
                userCourseData =  await UserCourseModel.getUserBySubscriptionId(userCourseData.subscription_id)
            }
           

            let courseArray = []

            if(userCourseData.length > 0){
                await Promise.all(
                    userCourseData.map(async (element) => {

                        let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: element?.course_id  },'')
                        await courseArray.push({
                            course_title: courseData?.course_title || "",
                            amount: element?.price || 0,
                            base_price: element?.amount || 0,
                            discount_amount: element?.discount_amount || 0,
                            discount: element?.discount || 0,
                            is_tax_inclusive: element?.is_tax_inclusive || false,
                            is_tax_exclusive: element?.is_tax_exclusive || false,
                            tax_percentage: element?.tax_percentage || 0
                        })
                    })
                )
            }

            let paymentStatus = "paid"

            if(invoiceData.payment_status == 1){
                paymentStatus = "unpaid"
            }else if(invoiceData.payment_status == 2){
                paymentStatus = "paid"
            }else if(invoiceData.payment_status == 3 || invoiceData.payment_status == 8){
                paymentStatus = "failed"
            }else if(invoiceData.payment_status == 4){
                paymentStatus = "unpaid"
            }else if(invoiceData.payment_status == 5 || invoiceData.payment_status == 6 || invoiceData.payment_status == 7){
                paymentStatus = "refunded"
            }
        
            const invoice = {
                status: paymentStatus, // unpaid, paid, failed, refunded
                amount: invoiceData?.amount,
                course_base_price: invoiceData?.course_base_price || 0,
                discount_amount: invoiceData?.discount_amount || 0,
                discount: invoiceData?.discount || 0,
                is_tax_inclusive: invoiceData?.is_tax_inclusive || false,
                is_tax_exclusive: invoiceData?.is_tax_exclusive || false,
                tax_percentage: invoiceData?.tax_percentage || 0,
                heman_discount_amount: invoiceData?.heman_discount_amount || 0,
                coupon_code: invoiceData?.coupon_code || '',
                coupon_amount: invoiceData?.coupon_amount || 0,
                tax_amount: invoiceData?.tax_amount || 0,
                convince_fee: invoiceData?.convince_fee || 0,
                convince_fee_amount: invoiceData?.convince_fee_amount || 0,
                username: `${userData.first_name} ${userData.last_name}`,
                issue_data: moment(new Date()).format('MMMM/DD/YYYY'),
                due_date: moment(new Date()).format('MMMM/DD/YYYY'),
                course_title: courseArray?.length > 0 ? courseArray[0].course_title : 0,
                invoice_id: invoiceData?.order_id ? invoiceData?.order_id : ""
            };
            //const pdfBody = await invoiceTemplate(invoice);

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: 'Invoice successfully download',
                data: invoice,
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: 'Failed to download invoice'
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getPaymentHistory:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to get the data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const singleTimePayment = async (userInputs,request) => {
    try{
        const { user_id, course_id } = userInputs;

        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id, course_id});

        if(getFilterData){
            if(getFilterData.type == 1){
                // course already assign to user
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Course is already assign",
                    error: {
                        course_title: "Course is already assign"
                    }
                };
            }else{
                // course already purchased by user
                if(getFilterData.type == 2 && getFilterData.payment_status == 2 && getFilterData.is_cancle_subscription == false){
                    return {
                        status: false,
                        status_code: constants.ERROR_RESPONSE,
                        message: "Course is already purchased",
                        error: {
                            course_title: "Course is already purchased"
                        }
                    };
                }
            }
        }

        let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: course_id  }, request.get("Authorization"))
        if(courseData){
            if(courseData?.status !== 1 || courseData?.is_pause_enrollment === true){
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Sorry! Failed to purchase the course."
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Sorry! Failed to purchase the course."
            };
        }

        let cronLogData = {}
        let cronstartTime = Date.now()
        //create cron log
        let cronData = await createCronLogs({
            type: "purchasecourse",
            request: JSON.stringify(request.body),
            header: request.get("Authorization"),
            response: null,
            url: "user/paymenturl",
            start_time: new Date()
        })
        let cronId = cronData?.status ? cronData?.cron_id : ''

        cronLogData['course_data'] = courseData
        cronLogData['user_data'] = getFilterData

        if(courseData.course_subscription_type == 3){

            const getUserData = await UserModel.fatchUserById(user_id);

            cronLogData['user_data'] = getUserData
            
            //single time payment
            let finalAmount = courseData.discount_amount
            if(courseData.is_tax_exclusive){
                let taxAmount = parseInt(courseData.discount_amount) * parseFloat(courseData.tax_percentage) / 100 
                finalAmount = finalAmount + taxAmount
            }
        
            let amount = finalAmount
            let workingKey = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_KEY_TESTING : process.env.CCAVENUE_KEY
            let accessCode = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_ACCESS_CODE_TESTING : process.env.CCAVENUE_ACCESS_CODE
            let paymentUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_URL_TESTING : process.env.CCAVENUE_URL
            let merchant_id = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_MID_TESTING : process.env.CCAVENUE_MID
            let redirectUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_REDIRECT_URL_TESTING : process.env.CCAVENUE_REDIRECT_URL

            let paymentData = {
                merchant_id: merchant_id,
                order_id: "123456789",
                currency: "INR",
                amount: amount,
                language: "EN",
                billing_name: (getUserData?.first_name ? getUserData?.first_name : '') + " " + (getUserData?.last_name ? getUserData?.last_name : ''),
                billing_address:  'Santacruz', 
                billing_city: getUserData?.city || 'Rajkot',
                billing_state: getUserData?.state || 'Gujrat',
                billing_zip: getUserData?.pincode || '400054',
                billing_country: getUserData?.country || 'India',
                billing_tel: getUserData?.mobile_no || '9512742802',
                billing_email: getUserData?.email || 'demouser@gmail.com',
                merchant_param1: course_id,
                merchant_param2: user_id,
                integration_type: "iframe_normal",
                redirect_url: redirectUrl,
                cancel_url: redirectUrl
            }
    
            const stringified = qs.stringify(paymentData);
            let encRequest = encrypt(stringified, workingKey)
    
            paymentUrl = paymentUrl + "command=initiateTransaction&merchant_id="+merchant_id+"&encRequest="+encRequest+"&access_code="+accessCode
            
            cronLogData['create_user_course'] = courseData
            cronLogData['payment_url'] = paymentUrl

            //update cron log
            await updateCronLogs(cronId,{
                end_time: new Date(),
                details: JSON.stringify(cronLogData),
                cronstart_time: cronstartTime
            })

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: 'Payment url',
                data: paymentUrl,
            };
        }else{
            return {
                status: false,
                status_code: constants.EXCEPTION_ERROR_CODE,
                message: 'This course is not valid for single time payment',
                data: null,
            };
        }
        
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in purchaseCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to purchase course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const paymentResponse = async (request) => { 
    var ccavEncResponse='',
	ccavResponse = '',
	ccavPOST = '';
   let workingKey = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_KEY_TESTING : process.env.CCAVENUE_KEY

    if(request?.body?.encResp){
        var encryption = request.body.encResp;
        ccavResponse = decrypt(encryption,workingKey);
        var strArray = ccavResponse.split("&");
        let dataArray = []
        await Promise.all(
            strArray.map(element => {
                var parameter = element.split("=");
                dataArray[parameter[0]] = parameter[1]
            })
        )

        //console.log("request?.body?.encResp :: ", dataArray)

        let orderId = dataArray.order_id
        let userId = dataArray.merchant_param1
        let courseId = dataArray.merchant_param3
        let finalAmount = dataArray.mer_amount
        let deviceType = dataArray.merchant_param2 ? dataArray.merchant_param2 : 1
        let notificationDeviceId = dataArray?.merchant_param4 || null
        let paymentStatus = dataArray.order_status
        const userData = await UserModel.fatchUserById(userId);
        let invoiceData = await InvoiceModel.findOrderData(orderId)
        let userCourseData =  await UserCourseModel.getUserCourse({ invoice_id: invoiceData._id })

        if(paymentStatus == "Success"){

            //update user course data
            await UserCourseModel.updateUserCourseUsingInvoice(invoiceData._id,{
                payment_status: 2,
                is_send_mail: true,
                is_purchase: true
            })

          
            await InvoiceModel.updateInvoice(invoiceData._id, {  
                payment_id: dataArray.tracking_id, 
                payment_method: dataArray.payment_mode,
                payment_response: ccavResponse,
                payment_date: dataArray.trans_date,
                payment_status: 2
            })
            
            notificationDeviceId = notificationDeviceId ? notificationDeviceId : userData?.notification_device_id
            if(notificationDeviceId){
                let notificationdata = {
                    module: "course_payment_success",
                    reference_id: orderId
                }
                if(deviceType == 1 || deviceType == 2){
                    await sendPushNotification({notification_device_id:[notificationDeviceId], message: "Course has been purchased successfully.", notificationdata, device_type: deviceType == 1 ? "android" : "ios" })
                }
            }

            const getUserCourseData = await UserCourseModel.getUserCoursePurchaseList({ user_id: userId});
            let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: invoiceData.course_id }, "") 


            if(userData && (userData?.referral_code || userData?.users_referral_code) && getUserCourseData?.length == 1){
                let courseAmount = courseData.discount_amount


                let couponAmount = invoiceData?.coupon_amount || 0
                let referralDiscount=  invoiceData?.heman_discount_amount || 0
                // decrease the course amount
                let coursePrice = (courseAmount - couponAmount) - referralDiscount
              
                if(userData?.referral_type == 1){
                    let hemanData = await CallEventBus("get_heman_by_code",{ referral_code: userData.referral_code }, '')    
               
                    if(hemanData){
                        if(hemanData.parent_heman_id){
                            let parentHemanData = await CallEventBus("get_heman_by_id",{ id: hemanData.parent_heman_id }, '')
                        
                            // calculate the heman commssion
                            let subHemanAmount = 0
                            if(parentHemanData?.sub_heman_commission){
                                if(parentHemanData.sub_heman_commission_type == 1){
                                    subHemanAmount = parentHemanData.sub_heman_commission
                                }else if(parentHemanData.sub_heman_commission_type == 2){
                                    let hemanCommission = parseInt(coursePrice) * parseFloat(parentHemanData.sub_heman_commission) / 100 
                                    subHemanAmount = hemanCommission
                                }
                            }

                            // calculate the heman commssion
                            let hemanAmount = 0
                            if(parentHemanData?.admin_heman_commission){
                                if(parentHemanData.admin_heman_commission_type == 1){
                                    hemanAmount = parentHemanData.admin_heman_commission
                                }else if(parentHemanData.admin_heman_commission_type == 2){
                                let hemanCommission = parseInt(coursePrice) * parseFloat(parentHemanData.admin_heman_commission) / 100 
                                hemanAmount = hemanCommission
                                }
                            }

                            let hemanDiscount = 0
                            if(parentHemanData?.student_discount){
                                let studentDiscount = parentHemanData?.student_discount ? parentHemanData.student_discount  : 0
                                if(parentHemanData.student_discount_type == 1){
                                    hemanDiscount = studentDiscount
                                }else if(parentHemanData.student_discount_type == 2){
                                    hemanDiscount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                                }
                            }
                            
                            let hemanuser = {
                                user_id: userId,
                                course_id: invoiceData.course_id,
                                assign_at: new Date(),
                                course_amount: courseAmount,
                                course_tax_amount: finalAmount,
                                code: userData.referral_code,
                                heman_id: hemanData.parent_heman_id,
                                sub_heman_id: hemanData._id,
                                heman_amount: hemanAmount,
                                sub_heman_amount: subHemanAmount,
                                user_discount: hemanDiscount,
                                order_id: orderId
                            } 
                            subHemanAmount = subHemanAmount  + (hemanData.amount || 0)
                            hemanAmount = hemanAmount  + (parentHemanData.amount || 0)

                            CallEventBus("add_heman_user",{  heman_id: hemanData.parent_heman_id, sub_heman_id: hemanData._id, user: hemanuser, heman_amount: hemanAmount, sub_heman_amount: subHemanAmount }, "")
                        }else{    

                            let hemanDiscount = 0
                            if(hemanData?.student_discount){
                                let studentDiscount = hemanData?.student_discount ? hemanData.student_discount  : 0
                                if(hemanData.student_discount_type == 1){
                                    hemanDiscount = studentDiscount
                                }else if(hemanData.student_discount_type == 2){
                                    hemanDiscount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                                }
                            }
                        
                            // calculate the heman commssion
                            let hemanAmount = 0
                            if(hemanData?.heman_commission){
                                if(hemanData.heman_commission_type == 1){
                                    hemanAmount = hemanData.heman_commission
                                }else if(hemanData.heman_commission_type == 2){
                                let hemanCommission = parseInt(coursePrice) * parseFloat(hemanData.heman_commission) / 100 
                                    hemanAmount = hemanCommission
                                }
                            }
                            
                            let hemanuser = {
                                user_id: userId,
                                course_id: invoiceData.course_id,
                                assign_at: new Date(),
                                course_amount: courseAmount,
                                course_tax_amount: finalAmount,
                                code: userData.referral_code,
                                heman_id: hemanData._id,
                                sub_heman_id: null,
                                heman_amount: hemanAmount,
                                sub_heman_amount: 0,
                                user_discount: hemanDiscount,
                                order_id: orderId
                            } 
                            hemanAmount = hemanAmount  + (hemanData.amount || 0)
                            CallEventBus("add_heman_user",{ heman_id: hemanData._id,sub_heman_id: null, user: hemanuser, heman_amount: hemanAmount, sub_heman_amount: 0 }, "")
                        }
                    }
                }else if(userData?.referral_type == 2){
                    let accountSettingData = await CallEventBus("get_account_setting_data",{  }, "")
    
                    if(accountSettingData){
                        let hemanDiscount = 0
                        let studentDiscount = accountSettingData?.student_discount_amount ? accountSettingData.student_discount_amount  : 0
                        if(accountSettingData.student_discount_type == 1){
                            hemanDiscount = studentDiscount
                        }else if(accountSettingData.student_discount_type == 2){
                            let discount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                            hemanDiscount = discount
                        }


                        let commissionAmount = 0
                        let userAmount = accountSettingData?.referral_discount_amount ? accountSettingData.referral_discount_amount  : 0
                        if(userAmount){
                            if(accountSettingData.referral_discount_type == 1){
                                commissionAmount = userAmount
                            }else if(accountSettingData.referral_discount_type == 2){
                                let discount = parseInt(coursePrice) * parseFloat(userAmount) / 100 
                                commissionAmount = discount
                            }

                            await UserCourseModel.userEarning({
                                code: userData.referral_code,
                                user_id: userId,
                                course_id: invoiceData.course_id,
                                course_amount: courseAmount,
                                assign_at: new Date(),
                                amount: commissionAmount,
                                user_discount: hemanDiscount,
                                order_id: orderId,
                                transaction_type: 1
                            })
                        }
                    }
                }
            }

            UserModel.updateUser(userId,{ 
                is_purchase_course: true
            });

            
        }else if(paymentStatus == "Failure" || paymentStatus == "Aborted"){
            //update user course data
            await UserCourseModel.updateUserCourseUsingInvoice(invoiceData._id,{
                payment_status: 3,
                is_send_mail: false,
                is_purchase: false
            })

            await InvoiceModel.updateInvoice(invoiceData._id, {  
                payment_id: dataArray.tracking_id, 
                payment_method: dataArray.payment_mode,
                payment_response: ccavResponse,
                payment_date: dataArray.trans_date,
                payment_status: 3
            })
            notificationDeviceId = notificationDeviceId ? notificationDeviceId : userData?.notification_device_id
            if(notificationDeviceId){
                let notificationdata = {
                    module: "course_payment_failure",
                    reference_id: orderId
                }
                if(deviceType == 1 || deviceType == 2){
                    await sendPushNotification({notification_device_id:[notificationDeviceId], message: "Failed to purchase the course.", notificationdata, device_type: deviceType == 1 ? "android" : "ios"})
                }
            }
        }

        //send a invoice mail
        if(userCourseData && userData?.email){
            let courseArray = []

            if(userCourseData.length > 0){
                await Promise.all(
                    userCourseData.map(async (element) => {
                        let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: element?.course_id  },'')
                        await courseArray.push({
                            course_title: courseData?.course_title || "",
                            amount: element?.price || 0,
                        })
                    })
                )
            }
            
            const pdfName = orderId+".pdf";

            await new Promise(async (resolve, reject) => {
                const invoice = {
                    status: paymentStatus, // unpaid, paid, failed, refunded
                    amount: dataArray.amount,
                    course_base_price: invoiceData?.course_base_price || 0,
                    discount_amount: invoiceData?.discount_amount || 0,
                    discount: invoiceData?.discount || 0,
                    is_tax_inclusive: invoiceData?.is_tax_inclusive || false,
                    is_tax_exclusive: invoiceData?.is_tax_exclusive || false,
                    tax_percentage: invoiceData?.tax_percentage || 0,
                    heman_discount_amount: invoiceData?.heman_discount_amount || 0,
                    coupon_code: invoiceData?.coupon_code || '',
                    coupon_amount: invoiceData?.coupon_amount || 0,
                    tax_amount: invoiceData?.tax_amount || 0,
                    convince_fee: invoiceData?.convince_fee || 0,
                    convince_fee_amount: invoiceData?.convince_fee_amount || 0,
                    username: `${userData.first_name} ${userData.last_name}`,
                    issue_data: moment(new Date()).format('MMMM/DD/YYYY'),
                    due_date: moment(new Date()).format('MMMM/DD/YYYY'),
                    course_title: courseArray?.length > 0 ? courseArray[0].course_title : 0,
                    invoice_id: invoiceData?.order_id ? invoiceData?.order_id : ""
                };
                const pdfBody = await invoiceTemplate(invoice);
                const result = await generatePDF(pdfBody, pdfName);
                if(result){
                    resolve(true)
                }
            })
        
            let email = userData?.email
            let subject = `Invoice for course payment`;
        
            let filePath = 'uploads/'+pdfName;

            //send subscription invoice mail
            let sendwait = await sendMail(email, "", subject, userId, "Course Payment", true, filePath, pdfName)

            if(sendwait){
                if (fs.existsSync('uploads/'+pdfName)) {
                    fs.unlinkSync('uploads/'+pdfName);
                }
            }
        }
        return {
            status: true,
            payment_status: paymentStatus,
            course_id: invoiceData?.course_id || courseId
        };
       
        //payment reszponse
        // dataArray :::  [
        //     order_id: '1234564789',
        //     tracking_id: '312010061999',
        //     bank_ref_no: '1691122381736',
        //     order_status: 'Success',
        //     failure_message: '',
        //     payment_mode: 'Net Banking',
        //     card_name: 'AvenuesTest',
        //     status_code: 'null',
        //     status_message: 'Y',
        //     currency: 'INR',
        //     amount: '1.00',
        //     billing_name: 'Peter',
        //     billing_address: 'Santacruz',
        //     billing_city: 'Mumbai',
        //     billing_state: 'MH',
        //     billing_zip: '400054',
        //     billing_country: 'India',
        //     billing_tel: '9876543210',
        //     billing_email: 'testing@domain.com',
        //     delivery_name: '',
        //     delivery_address: '',
        //     delivery_city: '',
        //     delivery_state: '',
        //     delivery_zip: '',
        //     delivery_country: '',
        //     delivery_tel: '',
        //     merchant_param1: '',
        //     merchant_param2: '',
        //     merchant_param3: '',
        //     merchant_param4: '',
        //     merchant_param5: '',
        //     vault: 'N',
        //     offer_type: 'null',
        //     offer_code: 'null',
        //     discount_value: '0.0',
        //     mer_amount: '1.00',
        //     eci_value: 'null',
        //     retry: 'N',
        //     response_code: '0',
        //     billing_notes: '',
        //     trans_date: '04/08/2023 09:43:05',
        //     bin_countr
        // ]
    }else{
        return {
            status: false,
            payment_status: "Failure"
        };
    }
}

const testSubscription = async (userInputs) => {
    try{
      
        let workingKey = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_KEY_TESTING : process.env.CCAVENUE_KEY
        let accessCode = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_ACCESS_CODE_TESTING : process.env.CCAVENUE_ACCESS_CODE
        let subscriptionPlanUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_URL_TESTING : process.env.CCAVENUE_URL
        let merchantId = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_MID_TESTING : process.env.CCAVENUE_MID
        let redirectUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_REDIRECT_URL_TESTING : process.env.CCAVENUE_REDIRECT_URL
        let orderId = await findUniqueID()
        //let redirectUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_REDIRECT_URL_TESTING : process.env.CCAVENUE_REDIRECT_URL

        console.log("subscriptionPlanUrl ::: ", subscriptionPlanUrl)
        console.log("orderId ::: ", orderId)
        console.log("workingKey ::: ", workingKey)
        console.log("accessCode ::: ", accessCode)
        console.log("merchantId ::: ", merchantId)
        console.log("redirectUrl ::: ", redirectUrl)

        // Construct the payment-related parameters
        const subscriptionPlanData = {
            // merchant_id: merchantId,
            // order_id: orderId,
            // currency: 'INR',
            // amount: '100.00', // Subscription amount
            // billing_frequency: '1', // 1 for monthly, 3 for quarterly, 12 for annually
            // billing_name: "DEMO USER",
            // billing_address:  'Santacruz', 
            // billing_city: 'Rajkot',
            // billing_state:'Gujrat',
            // billing_zip:  '400054',
            // billing_country:  'India',
            // billing_tel:  '9512742802',
            // billing_email:'demouser@gmail.com',
            // integration_type: "iframe_normal",
            // redirect_url: redirectUrl,
            // cancel_url: redirectUrl


            merchant_id: merchantId,
            order_id: orderId,
            currency: "INR",
            amount: 100,
            language: "EN",
            billing_name: "DEMO",
            billing_address:  'Santacruz', 
            billing_city: 'Rajkot',
            billing_state:  'Gujrat',
            billing_zip:  '400054',
            billing_country: 'India',
            billing_tel: '9512742802',
            billing_email: 'demouser@gmail.com',
            merchant_param1: 1,
            si_type: "Fixed",
            si_mer_ref_no: merchantId,
            currency: 'INR',
            si_amount: '100.00',
            si_setup_amount: '100.00',
            si_frequency: "Month",
            si_frequency_no: 1,
            //si_billing_cycle: "",
            //si_start_date: ""
            integration_type: "iframe_normal",
            redirect_url: redirectUrl,
            cancel_url: redirectUrl
        };

        const stringified = qs.stringify(subscriptionPlanData);
        let encRequest = encrypt(stringified, workingKey)

        subscriptionPlanUrl = subscriptionPlanUrl + "command=initiateTransaction&merchant_id="+merchantId+"&encRequest="+encRequest+"&access_code="+accessCode

        return subscriptionPlanUrl;


        // Calculate and add the checksum to subscriptionPlanData
        // const checksumString = `${merchantId}|${subscriptionPlanData.order_id}|${subscriptionPlanData.amount}|${subscriptionPlanData.currency}|${accessCode}|${workingKey}`;
        // const checksum = crypto.createHash('sha256').update(checksumString).digest('hex');
        // subscriptionPlanData.checksum = checksum;

        // // Add payment details to the subscription plan data
        // subscriptionPlanData.card_number = '4200000000000000';
        // subscriptionPlanData.expiry_month = '02';
        // subscriptionPlanData.expiry_year = '2025';
        // subscriptionPlanData.cvv = '123';
        // subscriptionPlanData.card_holder_name = 'DEMO CARD';

        // console.log("subscriptionPlanData ::: ", subscriptionPlanData)

        // return axios.post(subscriptionPlanUrl, subscriptionPlanData)
        // .then(response => {
        //     // Handle the API response here
        //     console.log('Subscription plan creation response:', response.data);
        //     return response.data
        // })
        // .catch(error => {
        //     // Handle errors
        //     console.error('Subscription plan creation error:', error);
        //     return error
        // });

    }catch (error) {
        // Handle unexpected errors
        console.error('Error in purchaseCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to purchase course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const getUserEarningHistory = async (userInputs) => {
    try{
        const { user_id, startToken, endToken, transaction_type } = userInputs;

        const perPage = parseInt(endToken) || 10; 
        let page = Math.max((parseInt(startToken) || 1) - 1, 0); 
        if (page !== 0) { 
            page = perPage * page; 
        }

        //get course data
        const userEarningHistory = await UserCourseModel.getUserEarningHistory({ user_id,  page, perPage, transaction_type });

        if(userEarningHistory){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: userEarningHistory
            }
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected error
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const makeUserEarningPayment = async (userInputs) => {
    try{
        const { user_id, payment_detail_id, amount } = userInputs;

        if(amount > 0){
            let accountSettingData = await CallEventBus("get_account_setting_data",{  }, "")
            const totalTransation = await UserCourseModel.countTransation({ user_id,transaction_type : 1 });
            
            if(totalTransation >= accountSettingData?.referral_after_purchase_of){
                //get available withdraw amount
                const totalEarningAmount = await UserCourseModel.getUserWithdrawAmount({ user_id, transaction_type : 1, with_date: 1 });
                const totalWithdrawAmount = await UserCourseModel.getUserWithdrawAmount({ user_id, transaction_type : 2 });

                let availableWithdrawAmount = totalEarningAmount - totalWithdrawAmount
                if(availableWithdrawAmount && availableWithdrawAmount >= amount){

                    await UserCourseModel.userEarning({
                        user_id: user_id,
                        amount: amount,
                        transaction_type: 2,
                        payment_detail_id: payment_detail_id
                    })

                    return {
                        status: true,
                        status_code: constants.SUCCESS_RESPONSE,
                        message: "Withdraw amount under process.",
                        availableWithdrawAmount:  availableWithdrawAmount
                    }
                }else {
                    return {
                        status: false,
                        status_code: constants.EXCEPTION_ERROR_CODE,
                        message: `Available withdraw is ${ availableWithdrawAmount }.`,
                        error: { server_error: `Available withdraw is ${ availableWithdrawAmount }.` },
                        data: null,
                    };
                }
            }else{
                return {
                    status: false,
                    status_code: constants.EXCEPTION_ERROR_CODE,
                    message: `Withdraw a amount after ${ accountSettingData?.referral_after_purchase_of }.`,
                    error: { server_error:  `Withdraw a amount after ${ accountSettingData?.referral_after_purchase_of }.` },
                    data: null,
                };
            }
        }else{
            return {
                status: false,
                status_code: constants.EXCEPTION_ERROR_CODE,
                message: 'Enter valid amount',
                error: { amount: 'Enter valid amount' },
                data: null,
            };
        }
    }catch (error) {
        // Handle unexpected error
        console.log("error ::", error)
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const earningOverview = async (userInputs) => {
    try{
        const { user_id} = userInputs;

        const totalEarningAmount = await UserCourseModel.getUserWithdrawAmount({ user_id, transaction_type : 1 });
        const totalWithdrawAmount = await UserCourseModel.getUserWithdrawAmount({ user_id, transaction_type : 2 });
        const totalAvailableEarning = await UserCourseModel.getUserWithdrawAmount({ user_id, transaction_type : 1, with_date: 1 });

        let availableWithdrawAmount = totalAvailableEarning - totalWithdrawAmount
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data get successfully.",
            data: {
                total_earning_amount: totalEarningAmount,
                total_withdraw_amount: totalWithdrawAmount,
                available_amount: availableWithdrawAmount
            }
        }
    }catch (error) {
        // Handle unexpected error
        console.log("error ::", error)
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const updateTransactionStatus = async (userInputs) => {
    try{
        const { transaction_id, payment_transaction_id, reason, transaction_status } = userInputs;

        //get course data
        const updateUserEarning = await UserCourseModel.updateUserEarning(transaction_id,{ 
            transaction_id: payment_transaction_id,  
            reason: reason, 
            amount_credited: transaction_status
        });

        if(updateUserEarning){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Status updated successfully"
            }
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data not found"
            };
        }
    }catch (error) {
        // Handle unexpected error
        console.log("error ::", error)
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'An unexpected error occurred',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const checkCoursePurchase = async (userInputs) => {
    try{
        const { user_id, course_id } = userInputs;

       
        //get course data
        const getFilterData = await UserCourseModel.filterUserCourseData({ user_id, course_id});

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
        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: 'Check course purchased',
            is_purchase: isPurchase
        };
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in purchaseCourse:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to purchase course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
  
}

const sendTestMail = async (request) => { 

            
        const pdfName = "sdfsdfsfsd.pdf";

        await new Promise(async (resolve, reject) => {
            const invoice = {
                status: "paid", 
                amount: 1000,
                course_base_price: 100,
                discount_amount: 10,
                discount: 10,
                is_tax_inclusive: false,
                is_tax_exclusive: false,
                tax_percentage: 10,
                heman_discount_amount: 10,
                coupon_code: '',
                coupon_amount: 10,
                tax_amount: 10,
                convince_fee: 2,
                convince_fee_amount: 10,
                username: `fdgdfg dfgd gdf dg`,
                issue_data: moment(new Date()).format('MMMM/DD/YYYY'),
                due_date: moment(new Date()).format('MMMM/DD/YYYY'),
                course_title: "gdfgfdfddfgdff",
                invoice_id: "dfgdgdfgfdfd"
            };
            const pdfBody = await invoiceTemplate(invoice);
            console.log("pdfBody ::::: ", pdfBody)
            const result = await generatePDF(pdfBody, pdfName);
            if(result){
                resolve(true)
            }
        })

        let subject = `Invoice for course payment`;

        let filePath = 'uploads/'+pdfName;

        //send subscription invoice mail
        let sendwait = await sendMail("tjcloudtest@gmail.com", "", subject, "dfsfd", "Course Payment", true, filePath, pdfName)

        if(sendwait){
            if (fs.existsSync('uploads/'+pdfName)) {
                fs.unlinkSync('uploads/'+pdfName);
            }
        }

        return {
            status: true
        };
} 

const payByApplePay = async (userInputs, request) => { 

    const { user_id, course_id, transaction_id, amount, notification_device_id, heman_discount, coupon_code, coupon_amount,tax_amount, convince_fee_amount, payment_mode } = userInputs;
   
    let orderId = transaction_id
    let userId = user_id
    let courseId = course_id
    let finalAmount = amount
    let deviceType = 2
    let notificationDeviceId = notification_device_id
    let paymentStatus = "Success"
    const userData = await UserModel.fatchUserById(userId);
    let courseData = await CallCourseQueryEvent("get_course_data_by_id",{ id: courseId }, request.get("Authorization"))

    let invoiceData = {
        user_id: user_id, 
        course_type: 1,
        amount: amount,
        course_base_price: courseData.price,
        discount_amount: courseData.discount_amount,
        discount: courseData.discount,
        is_tax_inclusive: courseData.is_tax_inclusive,
        is_tax_exclusive: courseData.is_tax_exclusive,
        tax_percentage: courseData.tax_percentage,
        heman_discount_amount: heman_discount,
        coupon_code: coupon_code,
        coupon_amount: coupon_amount,
        tax_amount: Math.round(tax_amount),
        convince_fee: courseData?.convince_fee || 0,
        convince_fee_amount: Math.round(convince_fee_amount),
        purchase_time: new Date(),
        innitial_response: '',
        invoice_type: 2,
        module_name: "Checkout",
        order_id: orderId,
        course_id: course_id,
        payment_id: orderId, 
        payment_method: payment_mode || "applepay",
        payment_response: orderId,
        payment_date: new Date(),
        payment_status: 2
    }

    const createInvoice = await InvoiceModel.createInvoice(invoiceData);

    let userCourseData = {
        user_id: user_id, 
        course_id: courseData.course_id, 
        type: 2,
        purchase_date: new Date(),
        course_subscription_type: courseData.course_subscription_type,
        price: courseData.price,
        payment_method: "applepay",
        amount: finalAmount,
        discount_amount: courseData.discount_amount,
        discount: courseData.discount,
        is_tax_inclusive: courseData.is_tax_inclusive,
        is_tax_exclusive: courseData.is_tax_exclusive,
        tax_percentage: courseData.tax_percentage,
        heman_discount_amount: heman_discount,
        coupon_code: coupon_code,
        coupon_amount: coupon_amount,
        tax_amount:  Math.round(tax_amount),
        convince_fee: courseData?.convince_fee || 0,
        convince_fee_amount: Math.round(convince_fee_amount),
        invoice_id: createInvoice?._id || '',
        order_id: orderId,
        payment_status: 2,
        is_send_mail: true,
        is_purchase: true
    }

    if(courseData?.is_limitedtime  && courseData?.is_limitedtime == true){
        // Create a new date object
        const date = await getNewDate(courseData?.interval_time, courseData?.interval_count)

        userCourseData['duration'] = courseData?.interval_time ? courseData?.interval_time : null
        userCourseData['duration_time'] = courseData?.interval_count ? courseData?.interval_count : null
        userCourseData['expire_date'] = date
    }

    await UserCourseModel.assignUserCourse(userCourseData);

    
    notificationDeviceId = notificationDeviceId ? notificationDeviceId : userData?.notification_device_id
    if(notificationDeviceId){
        let notificationdata = {
            module: "course_payment_success",
            reference_id: orderId
        }
        if(deviceType == 1 || deviceType == 2){
            await sendPushNotification({notification_device_id:[notificationDeviceId], message: "Course has been purchased successfully.", notificationdata, device_type: deviceType == 1 ? "android" : "ios" })
        }
    }

    const getUserCourseData = await UserCourseModel.getUserCoursePurchaseList({ user_id: userId});

    if(userData && (userData?.referral_code || userData?.users_referral_code) && getUserCourseData?.length == 1){
        let courseAmount = courseData.discount_amount


        let couponAmount = coupon_amount || 0
        let referralDiscount= heman_discount || 0
        // decrease the course amount
        let coursePrice = (courseAmount - couponAmount) - referralDiscount
        
        if(userData?.referral_type == 1){
            let hemanData = await CallEventBus("get_heman_by_code",{ referral_code: userData.referral_code }, '')    
        
            if(hemanData){
                if(hemanData.parent_heman_id){
                    let parentHemanData = await CallEventBus("get_heman_by_id",{ id: hemanData.parent_heman_id }, '')
                
                    // calculate the heman commssion
                    let subHemanAmount = 0
                    if(parentHemanData?.sub_heman_commission){
                        if(parentHemanData.sub_heman_commission_type == 1){
                            subHemanAmount = parentHemanData.sub_heman_commission
                        }else if(parentHemanData.sub_heman_commission_type == 2){
                            let hemanCommission = parseInt(coursePrice) * parseFloat(parentHemanData.sub_heman_commission) / 100 
                            subHemanAmount = hemanCommission
                        }
                    }

                    // calculate the heman commssion
                    let hemanAmount = 0
                    if(parentHemanData?.admin_heman_commission){
                        if(parentHemanData.admin_heman_commission_type == 1){
                            hemanAmount = parentHemanData.admin_heman_commission
                        }else if(parentHemanData.admin_heman_commission_type == 2){
                        let hemanCommission = parseInt(coursePrice) * parseFloat(parentHemanData.admin_heman_commission) / 100 
                        hemanAmount = hemanCommission
                        }
                    }

                    let hemanDiscount = 0
                    if(parentHemanData?.student_discount){
                        let studentDiscount = parentHemanData?.student_discount ? parentHemanData.student_discount  : 0
                        if(parentHemanData.student_discount_type == 1){
                            hemanDiscount = studentDiscount
                        }else if(parentHemanData.student_discount_type == 2){
                            hemanDiscount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                        }
                    }
                    
                    let hemanuser = {
                        user_id: userId,
                        course_id: invoiceData.course_id,
                        assign_at: new Date(),
                        course_amount: courseAmount,
                        course_tax_amount: finalAmount,
                        code: userData.referral_code,
                        heman_id: hemanData.parent_heman_id,
                        sub_heman_id: hemanData._id,
                        heman_amount: hemanAmount,
                        sub_heman_amount: subHemanAmount,
                        user_discount: hemanDiscount,
                        order_id: orderId
                    } 
                    subHemanAmount = subHemanAmount  + (hemanData.amount || 0)
                    hemanAmount = hemanAmount  + (parentHemanData.amount || 0)

                    CallEventBus("add_heman_user",{  heman_id: hemanData.parent_heman_id, sub_heman_id: hemanData._id, user: hemanuser, heman_amount: hemanAmount, sub_heman_amount: subHemanAmount }, "")
                }else{    

                    let hemanDiscount = 0
                    if(hemanData?.student_discount){
                        let studentDiscount = hemanData?.student_discount ? hemanData.student_discount  : 0
                        if(hemanData.student_discount_type == 1){
                            hemanDiscount = studentDiscount
                        }else if(hemanData.student_discount_type == 2){
                            hemanDiscount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                        }
                    }
                
                    // calculate the heman commssion
                    let hemanAmount = 0
                    if(hemanData?.heman_commission){
                        if(hemanData.heman_commission_type == 1){
                            hemanAmount = hemanData.heman_commission
                        }else if(hemanData.heman_commission_type == 2){
                        let hemanCommission = parseInt(coursePrice) * parseFloat(hemanData.heman_commission) / 100 
                            hemanAmount = hemanCommission
                        }
                    }
                    
                    let hemanuser = {
                        user_id: userId,
                        course_id: invoiceData.course_id,
                        assign_at: new Date(),
                        course_amount: courseAmount,
                        course_tax_amount: finalAmount,
                        code: userData.referral_code,
                        heman_id: hemanData._id,
                        sub_heman_id: null,
                        heman_amount: hemanAmount,
                        sub_heman_amount: 0,
                        user_discount: hemanDiscount,
                        order_id: orderId
                    } 
                    hemanAmount = hemanAmount  + (hemanData.amount || 0)
                    CallEventBus("add_heman_user",{ heman_id: hemanData._id,sub_heman_id: null, user: hemanuser, heman_amount: hemanAmount, sub_heman_amount: 0 }, "")
                }
            }
        }else if(userData?.referral_type == 2){
            let accountSettingData = await CallEventBus("get_account_setting_data",{  }, "")

            if(accountSettingData){
                let hemanDiscount = 0
                let studentDiscount = accountSettingData?.student_discount_amount ? accountSettingData.student_discount_amount  : 0
                if(accountSettingData.student_discount_type == 1){
                    hemanDiscount = studentDiscount
                }else if(accountSettingData.student_discount_type == 2){
                    let discount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                    hemanDiscount = discount
                }


                let commissionAmount = 0
                let userAmount = accountSettingData?.referral_discount_amount ? accountSettingData.referral_discount_amount  : 0
                if(userAmount){
                    if(accountSettingData.referral_discount_type == 1){
                        commissionAmount = userAmount
                    }else if(accountSettingData.referral_discount_type == 2){
                        let discount = parseInt(coursePrice) * parseFloat(userAmount) / 100 
                        commissionAmount = discount
                    }

                    await UserCourseModel.userEarning({
                        code: userData.referral_code,
                        user_id: userId,
                        course_id: invoiceData.course_id,
                        course_amount: courseAmount,
                        assign_at: new Date(),
                        amount: commissionAmount,
                        user_discount: hemanDiscount,
                        order_id: orderId,
                        transaction_type: 1
                    })
                }
            }
        }
    }

    UserModel.updateUser(userId,{ 
        is_purchase_course: true
    });

    //send a invoice mail
    if(userCourseData && userData?.email){
        let courseArray = []

        if(userCourseData.length > 0){
            await Promise.all(
                userCourseData.map(async (element) => {
                    let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: element?.course_id  },'')
                    await courseArray.push({
                        course_title: courseData?.course_title || "",
                        amount: element?.price || 0,
                    })
                })
            )
        }
        
        const pdfName = orderId+".pdf";

        await new Promise(async (resolve, reject) => {
            const invoice = {
                status: "paid",
                amount: finalAmount,
                course_base_price:  courseData?.price || 0,
                discount_amount: courseData?.discount_amount|| 0,
                discount: courseData?.discount || 0,
                is_tax_inclusive: courseData?.is_tax_inclusive || false,
                is_tax_exclusive: courseData?.is_tax_exclusive || false,
                tax_percentage: courseData?.tax_percentage || 0,
                heman_discount_amount: heman_discount || 0,
                coupon_code: coupon_code || '',
                coupon_amount: coupon_amount || 0,
                tax_amount: tax_amount ? Math.round(tax_amount) : 0,
                convince_fee: courseData?.convince_fee || 0,
                convince_fee_amount: convince_fee_amount ? Math.round(convince_fee_amount) : 0,
                username: `${userData.first_name} ${userData.last_name}`,
                issue_data: moment(new Date()).format('MMMM/DD/YYYY'),
                due_date: moment(new Date()).format('MMMM/DD/YYYY'),
                course_title: courseData?.course_title || "Course",
                invoice_id: orderId
            };
            const pdfBody = await invoiceTemplate(invoice);
            const result = await generatePDF(pdfBody, pdfName);
            if(result){
                resolve(true)
            }
        })
    
        let email = userData?.email
        let subject = `Invoice for course payment`;
    
        let filePath = 'uploads/'+pdfName;

        //send subscription invoice mail
        let sendwait = await sendMail(email, "", subject, userId, "Course Payment", true, filePath, pdfName)

        if(sendwait){
            if (fs.existsSync('uploads/'+pdfName)) {
                fs.unlinkSync('uploads/'+pdfName);
            }
        }
    }
    return {
        status: true,
        payment_status: paymentStatus,
        course_id: courseId
    };
}

module.exports = {
    assignCourse,
    getAssignCourseList,
    deleteUserCourse,
    updateAssignCourse,
    getAssignCourseById,
    purchaseCourse,
    mylearning,
    countCourseUser,
    coursePaymentResponse,
    checkCourseSubscription,
    checkexpiredCourse,
    getExpiringCourses,
    cancelCourseSubscription,
    getPaymentHistory,
    getInvoice,
    singleTimePayment,
    paymentResponse,
    testSubscription,
    getUserEarningHistory,
    makeUserEarningPayment,
    earningOverview,
    updateTransactionStatus,
    checkCoursePurchase,
    sendTestMail,
    payByApplePay
}