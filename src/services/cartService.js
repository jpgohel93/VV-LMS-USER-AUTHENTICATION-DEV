const { CartModel, UserCourseModel, UserModel, InvoiceModel } = require("../database");
const constants = require('../utils/constant');
const { CallCourseQueryEvent, CallEventBus } = require('../utils/call-event-bus');
const { createCronLogs, updateCronLogs, getNewDate, findUniqueID } = require('../utils');
const { encrypt } = require('../utils/ccavenue');
const qs = require('querystring');
const moment = require('moment');

const addCart = async (userInputs) => {
    try {
        const { user_id, course_id } = userInputs;
        let checkCartData = await CartModel.filterCartData(user_id, course_id);
        console.log('checkCartData :: ',checkCartData);
    
        if(checkCartData == null){
            const createCart = await CartModel.createCart({ 
                user_id: user_id,
                course_id: course_id
            });
    
            if(createCart !== false){
                return {
                    status: true,
                    status_code: constants.SUCCESS_RESPONSE,
                    message: "Course add into the cart",
                    id: createCart._id
                };
            }else{
                return {
                    status: false,
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to add the course into cart",
                    id: null
                };
            }
        }else{
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "The course is already added to the cart.",
                id: checkCartData._id
            };
        }
	}catch (error) {
        // Handle unexpected errors
        console.error('Error in addCart:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to add the course into cart',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }

   
}

const getCartsData = async (userInputs, request) => {
    try{
        const { user_id  } = userInputs;

        const getCartData = await CartModel.fatchCartList(user_id);

        const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: user_id});
        const getUserData = await UserModel.fatchUserById(user_id);
        
        if(getCartData){
            let promiseCartData = null;
            if(getCartData.length > 0){
                let cartData = [];
                promiseCartData = await new Promise(async (resolve, reject) => {
                    getCartData.map(async (cartElement, cartKey) => {

                        let course = await CallCourseQueryEvent("get_course_data_by_id",{ id: cartElement.course_id  }, request.get("Authorization"))
                        let courseDefault = await CallCourseQueryEvent("get_course_default_promotional_content",{ course_id: cartElement.course_id  }, request.get("Authorization"))

                        let courseAmount = course.discount_amount
                        let taxAmount = 0
                        let finalAmount = 0
                        if(course.is_tax_exclusive){
                            taxAmount = parseInt(courseAmount) * parseFloat(course.tax_percentage) / 100 
                            finalAmount = courseAmount + taxAmount
                        }

                        let convinceFeeAmount = 0
                        if(course?.convince_fee){
                            convinceFeeAmount = parseInt(courseAmount) * parseFloat(course.convince_fee) / 100 
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
                                }
                            }
                        }

                        await cartData.push({
                            _id: cartElement.id,
                            course_title: course?.course_title,
                            course_id: course?.course_id,
                            short_description: course?.short_description,
                            course_title: course?.course_title,
                            file_path: courseDefault?.web_image ? courseDefault?.web_image : null,
                            course_level: course?.course_level ? course?.course_level : null,
                            leason_count: course?.leason_count ? course?.leason_count : 0,
                            total_watch_hours: course?.total_watch_hours ? course?.total_watch_hours : 0,
                            average_review: course?.average_review ? course?.average_review : 0,
                            price: course?.price ? course?.price : 0,
                            currency: course?.currency ? course?.currency : 0,
                            discount: course?.discount ? course?.discount : 0,
                            discount_amount: course?.discount_amount ? course?.discount_amount : 0,
                            convince_fee: course?.convince_fee || 0,
                            convince_fee_amount: convinceFeeAmount,
                            tax_amount: taxAmount,
                            is_tax_exclusive: course?.is_tax_exclusive || false,
                            tax_percentage: course?.tax_percentage || 0,
                            referral_discount: hemanDiscount,
                            final_amount: finalAmount
                        })

                        if (getCartData.length === (cartKey + 1)) {
                            resolve(cartData)
                        }
                    });
                });
            }
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data get successfully",
                data: promiseCartData
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Data not found",
                data: null
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCartsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const deleteCartItem = async (userInputs) => {
    try{
        const { id } = userInputs;

        const deleteCartItem = await CartModel.removeCartData(id);
        
        if(deleteCartItem){
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Cart deleted successfully"
            };
        }else{
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to delete cart"
            };
        }
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCartsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to delete cart course',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const checkOut = async (userInputs,request) => {
    try{
        const { user_id, course_id, coupon_code, device_type } = userInputs;

        const getUserData = await UserModel.fatchUserById(user_id);

        if(course_id?.length == 0){
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to purchase course. Please select atlist one course",
                id: null
            };
        }

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
        if(isPurchase){
            return {
                status: false,
                status_code: constants.EXCEPTION_ERROR_CODE,
                message: 'Course already purchased',
                error: { is_purchase: 'Course already purchased' },
                data: null,
            };
        }

        let cronLogData = {}
        let cronstartTime = Date.now()
        //create cron log
        let cronData = await createCronLogs({
            type: "checkOutCorse",
            request: JSON.stringify(request.body),
            header: request.get("Authorization"),
            response: null,
            url: "cart/checkOut",
            start_time: new Date()
        })
        let cronId = cronData?.status ? cronData?.cron_id : ''

        let courseData = await CallCourseQueryEvent("get_course_data_by_id",{ id: course_id }, request.get("Authorization"))
        cronLogData['course_data'] = courseData

        const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: user_id});

        if(courseData){ 
            let userCourseArray = []

            let courseAmount = courseData.discount_amount
            let taxAmount = 0
            let finalAmount = courseAmount
            let orderId = await findUniqueID()
          
            let hemanDiscount = 0
           
            if(getUserData && (getUserData?.referral_code || getUserData?.users_referral_code) && getUserCourseData?.length == 0){
                if(getUserData?.referral_type == 1){
                    let hemanData = await CallEventBus("get_heman_by_code",{ referral_code: getUserData.referral_code }, request.get("Authorization"))                        
                    if(hemanData){
                        if(hemanData.parent_heman_id){
                            let parentHemanData = await CallEventBus("get_heman_by_id",{ id: hemanData.parent_heman_id }, request.get("Authorization"))

                            // decrease the student discount amount 
                            if(parentHemanData?.student_discount){
                                let studentDiscount = parentHemanData?.student_discount ? parentHemanData.student_discount  : 0
                                if(parentHemanData.student_discount_type == 1){
                                    hemanDiscount = studentDiscount
                                    courseAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                                }else if(parentHemanData.student_discount_type == 2){
                                    let discount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                                    hemanDiscount = discount
                                    courseAmount = parseInt(finalAmount) - parseInt(discount)
                                }
                            }
                        
                            // decrease the course amount
                            //let coursePrice = courseAmount

                            // // calculate the heman commssion
                            // let subHemanAmount = 0
                            // if(parentHemanData?.sub_heman_commission){
                            //     if(parentHemanData.sub_heman_commission_type == 1){
                            //         subHemanAmount = parentHemanData.sub_heman_commission
                            //     }else if(parentHemanData.sub_heman_commission_type == 2){
                            //         let hemanCommission = parseInt(coursePrice) * parseFloat(parentHemanData.sub_heman_commission) / 100 
                            //         subHemanAmount = hemanCommission
                            //     }
                            // }

                            // // calculate the heman commssion
                            // let hemanAmount = 0
                            // if(parentHemanData?.admin_heman_commission){
                            //     if(parentHemanData.admin_heman_commission_type == 1){
                            //         hemanAmount = parentHemanData.admin_heman_commission
                            //     }else if(parentHemanData.admin_heman_commission_type == 2){
                            //     let hemanCommission = parseInt(coursePrice) * parseFloat(parentHemanData.admin_heman_commission) / 100 
                            //     hemanAmount = hemanCommission
                            //     }
                            // }
                            
                            // let hemanuser = {
                            //     user_id: user_id,
                            //     course_id: course_id,
                            //     assign_at: new Date(),
                            //     course_amount: courseAmount,
                            //     course_tax_amount: finalAmount,
                            //     code: getUserData.referral_code,
                            //     heman_id: hemanData.parent_heman_id,
                            //     sub_heman_id: hemanData._id,
                            //     heman_amount: hemanAmount,
                            //     sub_heman_amount: subHemanAmount,
                            //     user_discount: hemanDiscount,
                            //     order_id: orderId
                            // } 
                            // subHemanAmount = subHemanAmount  + (hemanData.amount || 0)
                            // hemanAmount = hemanAmount  + (parentHemanData.amount || 0)

                            // CallEventBus("add_heman_user",{  heman_id: hemanData.parent_heman_id, sub_heman_id: hemanData._id, user: hemanuser, heman_amount: hemanAmount, sub_heman_amount: subHemanAmount }, request.get("Authorization"))
                        }else{    
                            // decrease the student discount amount 
                            if(hemanData?.student_discount){
                                let studentDiscount = hemanData?.student_discount ? hemanData.student_discount  : 0
                                if(hemanData.student_discount_type == 1){
                                    hemanDiscount = studentDiscount
                                    finalAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                                }else if(hemanData.student_discount_type == 2){
                                    let discount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                                    hemanDiscount = discount
                                    finalAmount = parseInt(finalAmount) - parseInt(discount)
                                }
                            }
                        
                            // decrease the course amount
                            let coursePrice = courseAmount
                        
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
                            
                            // let hemanuser = {
                            //     user_id: user_id,
                            //     course_id: course_id,
                            //     assign_at: new Date(),
                            //     course_amount: courseAmount,
                            //     course_tax_amount: finalAmount,
                            //     code: getUserData.referral_code,
                            //     heman_id: hemanData._id,
                            //     sub_heman_id: null,
                            //     heman_amount: hemanAmount,
                            //     sub_heman_amount: 0,
                            //     user_discount: hemanDiscount,
                            //     order_id: orderId
                            // } 
                            // hemanAmount = hemanAmount  + (hemanData.amount || 0)

                            // CallEventBus("add_heman_user",{ heman_id: hemanData._id,sub_heman_id: null, user: hemanuser, heman_amount: hemanAmount, sub_heman_amount: 0 }, request.get("Authorization"))
                        }
                    }
                }else if(getUserData?.referral_type == 2){
                    let accountSettingData = await CallEventBus("get_account_setting_data",{  }, request.get("Authorization"))
    
                    if(accountSettingData){
                        let studentDiscount = accountSettingData?.student_discount_amount ? accountSettingData.student_discount_amount  : 0
                        if(accountSettingData.student_discount_type == 1){
                            hemanDiscount = studentDiscount
                            finalAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                        }else if(accountSettingData.student_discount_type == 2){
                            let discount = parseInt(courseAmount) * parseFloat(studentDiscount) / 100 
                            hemanDiscount = discount
                            finalAmount = parseInt(finalAmount) - parseInt(discount)
                        }

                        // let commissionAmount = 0
                        // let userAmount = accountSettingData?.referral_discount_amount ? accountSettingData.referral_discount_amount  : 0
                        // if(userAmount){
                        //     if(accountSettingData.referral_discount_type == 1){
                        //         commissionAmount = userAmount
                        //     }else if(accountSettingData.referral_discount_type == 2){
                        //         let discount = parseInt(courseAmount) * parseFloat(userAmount) / 100 
                        //         commissionAmount = discount
                        //     }

                        //     await UserCourseModel.userEarning({
                        //         code: getUserData.referral_code,
                        //         user_id: user_id,
                        //         course_id: course_id,
                        //         course_amount: courseAmount,
                        //         assign_at: new Date(),
                        //         amount: commissionAmount,
                        //         user_discount: hemanDiscount,
                        //         order_id: orderId,
                        //         transaction_type: 1
                        //     })
                        // }
                    }
                }
            }

            let userCourseData = {
                user_id: user_id, 
                course_id: courseData.course_id, 
                type: 2,
                purchase_date: new Date(),
                course_subscription_type: courseData.course_subscription_type,
                price: courseAmount,
                payment_method: "ccavenue",
                amount: finalAmount,
                discount_amount: courseData.discount_amount,
                discount: courseData.discount,
                is_tax_inclusive: courseData.is_tax_inclusive,
                is_tax_exclusive: courseData.is_tax_exclusive,
                tax_percentage: courseData.tax_percentage,
                heman_discount_amount: hemanDiscount
            }

            if(courseData?.is_limitedtime  && courseData?.is_limitedtime == true){
                // Create a new date object
                const date = await getNewDate(courseData?.interval_time, courseData?.interval_count)

                userCourseData['duration'] = courseData?.interval_time ? courseData?.interval_time : null
                userCourseData['duration_time'] = courseData?.interval_count ? courseData?.interval_count : null
                userCourseData['expire_date'] = date
            }

            let couponAmount = 0
            if(coupon_code){
                let couponData = await CallEventBus("get_coupon_data",{ coupon_code: coupon_code }, request.get("Authorization"))

                if(couponData){
                    if(couponData.discount_type == 1){
                        couponAmount = couponData.discount
                        finalAmount = parseInt(finalAmount) - parseInt(couponAmount)
                    }else if(couponData.discount_type == 2){
                        let discount = parseInt(courseAmount) * parseFloat(couponData.discount) / 100 
                        couponAmount = discount
                        finalAmount = parseInt(finalAmount) - parseInt(discount)
                    }

                    userCourseData['coupon_code'] = coupon_code
                    userCourseData['coupon_amount'] = couponAmount
                }
            }

            let courseDiscountAmount = finalAmount
            if(courseData?.is_tax_exclusive){
                taxAmount = parseInt(courseDiscountAmount) * parseFloat(courseData.tax_percentage) / 100 
                finalAmount = finalAmount + taxAmount
            }

            let convinceFeeAmount = 0
            if(courseData?.convince_fee){
                convinceFeeAmount = parseInt(courseDiscountAmount) * parseFloat(courseData.convince_fee) / 100 
                finalAmount = finalAmount + convinceFeeAmount
            }
            userCourseData['tax_amount'] = taxAmount
            userCourseData['convince_fee'] = courseData?.convince_fee || 0
            userCourseData['convince_fee_amount'] = convinceFeeAmount

            cronLogData['amount'] = finalAmount
            let amount = finalAmount
            if(amount > 0){

                let invoiceData = {
                    user_id: user_id, 
                    course_type: 1,
                    amount: amount
                }

                invoiceData['purchase_time'] = new Date()
                invoiceData['innitial_response'] = ''
                invoiceData['invoice_type'] = 2
                invoiceData['module_name'] = "Checkout"
                invoiceData['order_id'] = orderId
                invoiceData['course_id'] = course_id

                const createInvoice = await InvoiceModel.createInvoice(invoiceData);

                cronLogData['create_invoice'] = createInvoice

                let invoiceid = createInvoice?._id ? createInvoice?._id.toString() : null

                userCourseData['invoice_id'] = invoiceid
                userCourseData['order_id'] = orderId
                await UserCourseModel.assignUserCourse(userCourseData);

                UserCourseModel.updateUserCourse(user_id,{ 
                    is_purchase_course: true
                });

                let workingKey = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_KEY_TESTING : process.env.CCAVENUE_KEY
                let accessCode = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_ACCESS_CODE_TESTING : process.env.CCAVENUE_ACCESS_CODE
                let paymentUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_URL_TESTING : process.env.CCAVENUE_URL
                let merchant_id = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_MID_TESTING : process.env.CCAVENUE_MID
                let redirectUrl = process.env.DEVELOPER_MODE == "development" ? process.env.CCAVENUE_REDIRECT_URL_TESTING : process.env.CCAVENUE_REDIRECT_URL
             
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
                    merchant_param2: device_type ? device_type : 1,
                    integration_type: "iframe_normal",
                    redirect_url: redirectUrl,
                    cancel_url: redirectUrl
                }
        
                const stringified = qs.stringify(paymentData);
                let encRequest = encrypt(stringified, workingKey)
        
                paymentUrl = paymentUrl + "command=initiateTransaction&merchant_id="+merchant_id+"&encRequest="+encRequest+"&access_code="+accessCode
            
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
                    message: "Course purchase successfully",
                    order_id: orderId,
                    payment_url: paymentUrl
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
                    status_code: constants.DATABASE_ERROR_RESPONSE,
                    message: "Failed to purchase course",
                }
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

const qrCheckOut = async (userInputs,request) => {
    try{
        const { user_id, course_id } = userInputs;

        let courseData = await CallCourseQueryEvent("get_course_data_by_id",{ id: course_id }, request.get("Authorization"))
 
        if(courseData){
            let finalAmount = courseData.discount_amount
            let taxAmount = 0
            if(courseData.is_tax_exclusive){
                taxAmount = parseInt(courseData.discount_amount) * parseFloat(courseData.tax_percentage) / 100 
                finalAmount = finalAmount + taxAmount
            }

            const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: user_id});
            const getUserData = await UserModel.fatchUserById(user_id);
            let hemanDiscount = 0
            if(getUserData && getUserData?.referral_code && getUserCourseData && getUserCourseData?.length == 0){
                let hemanData = await CallEventBus("get_heman_by_code",{ referral_code: getUserData.referral_code }, request.get("Authorization"))

                if(hemanData.parent_heman_id){
                    let parentHemanData = await CallEventBus("get_heman_by_id",{ id: hemanData.parent_heman_id }, request.get("Authorization"))
                    if(parentHemanData?.student_discount){ 
                        let studentDiscount = parentHemanData?.student_discount ? parentHemanData.student_discount  : 0
                        if(parentHemanData.student_discount_type == 1){
                            finalAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                        }else if(parentHemanData.student_discount_type == 2){
                            let discount = parseInt(finalAmount) * parseFloat(studentDiscount) / 100 
                            finalAmount = parseInt(finalAmount) - parseInt(discount)
                        }
                    }
                }else{
                    if(hemanData?.student_discount){ 
                        let studentDiscount = hemanData?.student_discount ? hemanData.student_discount  : 0
                        if(hemanData.student_discount_type == 1){
                            finalAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                        }else if(hemanData.student_discount_type == 2){
                            let discount = parseInt(finalAmount) * parseFloat(studentDiscount) / 100 
                            finalAmount = parseInt(finalAmount) - parseInt(discount)
                        }
                    }
                }
            }

            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Course details",
                data: {
                    course_id: courseData.course_id,
                    course_title: courseData.course_title,
                    short_description: courseData.short_description,
                    discount: courseData.discount,
                    discount_amount: courseData.discount_amount,
                    price: courseData.price,
                    currency: courseData.currency,
                    is_tax_inclusive: courseData.is_tax_inclusive,
                    is_tax_exclusive: courseData.is_tax_exclusive,
                    tax_percentage: courseData?.tax_percentage || 0,
                    tax_amount: taxAmount,
                    final_amount: finalAmount,
                    convince_fee: courseData?.convince_fee,
                    referral_discount: hemanDiscount
                }
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

const courseCheckOut = async (userInputs, request) => {
   
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
        if(isPurchase){
            return {
                status: false,
                status_code: constants.EXCEPTION_ERROR_CODE,
                message: 'Course already purchased',
                error: { is_purchase: 'Course already purchased' },
                data: null,
            };
        }

        const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: user_id});
        const getUserData = await UserModel.fatchUserById(user_id);
        
        let course = await CallCourseQueryEvent("get_course_data_by_id",{ id: course_id }, request.get("Authorization"))
        let courseDefault = await CallCourseQueryEvent("get_course_default_promotional_content",{ course_id: course_id  }, request.get("Authorization"))

        let courseAmount = course.discount_amount
        let taxAmount = 0
        let finalAmount = courseAmount
       

        let hemanDiscount = 0
        if(getUserData && (getUserData?.referral_code || getUserData?.users_referral_code)  && getUserCourseData && getUserCourseData?.length == 0){
            if(getUserData?.referral_type == 1){
                let hemanData = await CallEventBus("get_heman_by_code",{ referral_code: getUserData.referral_code }, request.get("Authorization"))

                if(hemanData){
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
                        }
                    }
                }
            }else if(getUserData?.referral_type == 2){
                let accountSettingData = await CallEventBus("get_account_setting_data",{  }, request.get("Authorization"))

                if(accountSettingData){
                    let studentDiscount = accountSettingData?.student_discount_amount ? accountSettingData.student_discount_amount  : 0
                    if(accountSettingData.student_discount_type == 1){
                        hemanDiscount = studentDiscount
                        finalAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                    }else if(accountSettingData.student_discount_type == 2){
                        let discount = parseInt(finalAmount) * parseFloat(studentDiscount) / 100 
                        hemanDiscount = discount
                        finalAmount = parseInt(finalAmount) - parseInt(discount)
                    }
                }
            }
        }

        let courseDiscountAmount = finalAmount
        if(course.is_tax_exclusive){
            taxAmount = parseInt(courseDiscountAmount) * parseFloat(course.tax_percentage) / 100 
            finalAmount = finalAmount + taxAmount
        }

        let convinceFeeAmount = 0
        if(course?.convince_fee){
            convinceFeeAmount = parseInt(courseDiscountAmount) * parseFloat(course.convince_fee) / 100 
            finalAmount = finalAmount + convinceFeeAmount
        }

        let checkOutData = {
            course_title: course?.course_title,
            course_id: course?.course_id,
            short_description: course?.short_description,
            course_title: course?.course_title,
            file_path: courseDefault?.web_image ? courseDefault?.web_image : null,
            course_level: course?.course_level ? course?.course_level : null,
            leason_count: course?.leason_count ? course?.leason_count : 0,
            total_watch_hours: course?.total_watch_hours ? course?.total_watch_hours : 0,
            average_review: course?.average_review ? course?.average_review : 0,
            price: course?.price ? course?.price : 0,
            currency: course?.currency ? course?.currency : 0,
            discount: course?.discount ? course?.discount : 0,
            discount_amount: course?.discount_amount ? course?.discount_amount : 0,
            convince_fee: course?.convince_fee || 0,
            convince_fee_amount: convinceFeeAmount,
            tax_amount: taxAmount,
            is_tax_exclusive: course?.is_tax_exclusive || false,
            tax_percentage: course?.tax_percentage || 0,
            referral_discount: hemanDiscount,
            final_amount: finalAmount
        }

        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data get successfully",
            data: checkOutData
        };
       
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCartsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

const applyCoupon = async (userInputs, request) => {
    try{
        const { user_id, course_id, coupon_code } = userInputs;

        let couponData = await CallEventBus("get_coupon_data",{ coupon_code: coupon_code }, request.get("Authorization"))

        if(!couponData){
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Invalid coupon code",
                error: {
                    coupon_code: "Invalid coupon code"
                }
            };
        }
        // check all the coupon condition
        const getUserData = await UserModel.fatchUserById(user_id);
        const getUserCourseData = await UserCourseModel.getUserCourseList({ user_id: user_id});
        if(coupon_code){
            let isValidCoupon = false
            let checkCoupon = await CallEventBus("get_coupon_used_data",{ coupon_id: couponData._id, user_id: user_id }, request.get("Authorization"))

            if(checkCoupon?.length > 0){
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Coupon has been already used",
                    error: {
                        coupon_code: "Coupon has been already used"
                    }
                };
            }

            if(getUserCourseData && getUserCourseData?.length == 0  && (getUserData?.referral_code || getUserData?.users_referral_code)){
                if(couponData?.has_club_coupon){
                    isValidCoupon = true
                }else{
                    isValidCoupon = false
                }

                if(!isValidCoupon){
                    return {
                        status: false,
                        status_code: constants.ERROR_RESPONSE,
                        message: "Enter valid coupon code",
                        error: {
                            coupon_code: "Enter valid coupon code"
                        }
                    }; 
                }
            }
            
            if(couponData){
                if(couponData?.usage_limit > 0){
                    //count for coupon used Data
                    let couponUsedData = await CallEventBus("get_coupon_used_data",{ coupon_id: couponData._id }, request.get("Authorization"))

                    let count = couponUsedData?.length || 0

                    if(count >= couponData.usage_limit){
                        isValidCoupon = false
                    }else{
                        isValidCoupon = true
                    }
                }else{
                    isValidCoupon = true
                } 
    
                if(couponData?.users?.length > 0 && isValidCoupon){
                    if(couponData.users.includes(user_id)){
                        isValidCoupon = true
                    }else{
                        isValidCoupon = false 
                    }
                }
    
                if(couponData?.course?.length > 0 && isValidCoupon){
                    if(couponData.course.includes(course_id)){
                        isValidCoupon = true
                    }else{
                        isValidCoupon = false 
                    }
                }

                let currentDate = Date.now()
                if(couponData?.start_date && isValidCoupon){
                    let startDate = new Date(moment(couponData.start_date).format("YYYY-MM-DD")).valueOf();
                    
                    if(currentDate >= startDate){
                        isValidCoupon = true
                    }else{
                        isValidCoupon = false 
                    }
                }

                if(couponData?.end_date && isValidCoupon){
                   let endDate = new Date(moment(couponData.end_date).format("YYYY-MM-DD") + " 23:59:59").valueOf();

                    if(currentDate <= endDate){
                        isValidCoupon = true
                    }else{
                        isValidCoupon = false 
                    }

                }
            }

            if(!isValidCoupon){
                return {
                    status: false,
                    status_code: constants.ERROR_RESPONSE,
                    message: "Enter valid coupon code",
                    error: {
                        coupon_code: "Enter valid coupon code"
                    }
                }; 
            }
        }else{
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Enter valid coupon code",
                error: {
                    coupon_code: "Enter valid coupon code"
                }
            };
        }
        
        let course = await CallCourseQueryEvent("get_course_data_by_id",{ id: course_id }, request.get("Authorization"))
        let courseDefault = await CallCourseQueryEvent("get_course_default_promotional_content",{ course_id: course_id  }, request.get("Authorization"))

        let courseAmount = course.discount_amount
        let taxAmount = 0
        let finalAmount = courseAmount
        
        
        let hemanDiscount = 0
        if(getUserData && (getUserData?.referral_code || getUserData?.users_referral_code)  && getUserCourseData && getUserCourseData?.length == 0){
            if(getUserData?.referral_type == 1){
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
                    }
                }
            }else if(getUserData?.referral_type == 2){
                let accountSettingData = await CallEventBus("get_account_setting_data",{  }, request.get("Authorization"))

                if(accountSettingData){
                    let studentDiscount = accountSettingData?.student_discount_amount ? accountSettingData.student_discount_amount  : 0
                    if(accountSettingData.student_discount_type == 1){
                        hemanDiscount = studentDiscount
                        finalAmount = parseInt(finalAmount) - parseInt(studentDiscount)
                    }else if(accountSettingData.student_discount_type == 2){
                        let discount = parseInt(finalAmount) * parseFloat(studentDiscount) / 100 
                        hemanDiscount = discount
                        finalAmount = parseInt(finalAmount) - parseInt(discount)
                    }
                }
        
            }
            
        }

        let couponAmount = 0
        if(couponData){
            if(couponData.discount_type == 1){
                couponAmount = couponData.discount
                finalAmount = parseInt(finalAmount) - parseInt(couponAmount)
            }else if(couponData.discount_type == 2){
                let discount = parseInt(courseAmount) * parseFloat(couponData.discount) / 100 
                couponAmount = discount
                finalAmount = parseInt(finalAmount) - parseInt(discount)
            }
        }

        let courseDiscountAmount = finalAmount
        if(course.is_tax_exclusive){
            taxAmount = parseInt(courseDiscountAmount) * parseFloat(course.tax_percentage) / 100 
            finalAmount = finalAmount + taxAmount
        }

        let convinceFeeAmount = 0
        if(course?.convince_fee){
            convinceFeeAmount = parseInt(courseDiscountAmount) * parseFloat(course.convince_fee) / 100 
            finalAmount = finalAmount + convinceFeeAmount
        }

        let checkOutData = {
            course_title: course?.course_title,
            course_id: course?.course_id,
            short_description: course?.short_description,
            course_title: course?.course_title,
            file_path: courseDefault?.web_image ? courseDefault?.web_image : null,
            course_level: course?.course_level ? course?.course_level : null,
            leason_count: course?.leason_count ? course?.leason_count : 0,
            total_watch_hours: course?.total_watch_hours ? course?.total_watch_hours : 0,
            average_review: course?.average_review ? course?.average_review : 0,
            price: course?.price ? course?.price : 0,
            currency: course?.currency ? course?.currency : 0,
            discount: course?.discount ? course?.discount : 0,
            discount_amount: course?.discount_amount ? course?.discount_amount : 0,
            convince_fee: course?.convince_fee || 0,
            convince_fee_amount: convinceFeeAmount,
            tax_amount: taxAmount,
            is_tax_exclusive: course?.is_tax_exclusive || false,
            tax_percentage: course?.tax_percentage || 0,
            referral_discount: hemanDiscount,
            coupon_amount: couponAmount,
            final_amount: finalAmount,
            coupon_title: couponData.title,
            coupon_description: couponData.description,
            coupon_image: couponData.image,
            coupon_discount_type: couponData.discount_type,
            coupon_discount: couponData.discount
        }

        return {
            status: true,
            status_code: constants.SUCCESS_RESPONSE,
            message: "Data get successfully",
            data: checkOutData
        };
       
    }catch (error) {
        // Handle unexpected errors
        console.error('Error in getCartsData:', error);
        return {
            status: false,
            status_code: constants.EXCEPTION_ERROR_CODE,
            message: 'Failed to fetch data',
            error: { server_error: 'An unexpected error occurred' },
            data: null,
        };
    }
}

module.exports = {
    addCart,
    getCartsData,
    deleteCartItem,
    checkOut,
    qrCheckOut,
    courseCheckOut,
    applyCoupon
}