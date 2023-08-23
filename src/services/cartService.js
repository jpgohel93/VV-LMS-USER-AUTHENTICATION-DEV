const { CartModel, UserCourseModel, UserModel, InvoiceModel } = require("../database");
const constants = require('../utils/constant');
const { CallCourseQueryEvent } = require('../utils/call-event-bus');
const { createCronLogs, updateCronLogs, createApiCallLog, getNewDate, findUniqueID } = require('../utils');
const { encrypt } = require('../utils/ccavenue');
const qs = require('querystring');

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
        
        if(getCartData){
            let promiseCartData = null;
            if(getCartData.length > 0){
                let cartData = [];
                promiseCartData = await new Promise(async (resolve, reject) => {
                    getCartData.map(async (cartElement, cartKey) => {

                        let course = await CallCourseQueryEvent("get_course_data_by_id",{ id: cartElement.course_id  }, request.get("Authorization"))

                        await cartData.push({
                            _id: cartElement.id,
                            course_title: course?.course_title,
                            course_id: course?.course_id,
                            short_description: course?.short_description,
                            course_title: course?.course_title,
                            file_path: course?.default_file_path ? course?.default_file_path : null,
                            course_level: course?.course_level ? course?.course_level : null,
                            leason_count: course?.leason_count ? course?.leason_count : 0,
                            total_watch_hours: course?.total_watch_hours ? course?.total_watch_hours : 0,
                            average_review: course?.average_review ? course?.average_review : 0,
                            price: course?.price ? course?.price : 0,
                            currency: course?.currency ? course?.currency : 0,
                            discount: course?.discount ? course?.discount : 0,
                            discount_amount: course?.discount_amount ? course?.discount_amount : 0
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
        const { user_id, course_id } = userInputs;

        const getUserData = await UserModel.fatchUserById(user_id);

        if(course_id?.length == 0){
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to purchase course. Please select atlist one course",
                id: null
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

        let course = await CallCourseQueryEvent("get_course_data_without_auth",{ id: course_id }, request.get("Authorization"))
        cronLogData['course_data'] = course

        if(course?.length > 0){
            let userCourseArray = []
            let totalAmount = 0

            await Promise.all(
                await course.map(async (element , index) => {

                     let finalAmount = element.discount_amount
                    if(element.is_tax_exclusive){
                        let taxAmount = parseInt(element.discount_amount) * parseFloat(element.tax_percentage) / 100 
                        finalAmount = finalAmount + taxAmount
                    }
                    totalAmount = totalAmount + parseFloat(finalAmount)
                    let userCourseData = {
                        user_id: user_id, 
                        course_id: element.course_id, 
                        type: 2,
                        purchase_date: new Date(),
                        course_subscription_type: element.course_subscription_type,
                        price: finalAmount,
                        //payment_method: "razorpay",
                        payment_method: "ccavenue",
                        amount: element.price,
                        discount_amount: element.discount_amount,
                        discount: element.discount,
                        is_tax_inclusive: element.is_tax_inclusive,
                        is_tax_exclusive: element.is_tax_exclusive,
                        tax_percentage: element.tax_percentage
                    }

                    if(element?.is_limitedtime  && element?.is_limitedtime == true){
                        // Create a new date object
                        const date = await getNewDate(element?.interval_time, element?.interval_count)
        
                        userCourseData['duration'] = element?.interval_time ? element?.interval_time : null
                        userCourseData['duration_time'] = element?.interval_count ? element?.interval_count : null
                        userCourseData['expire_date'] = date
                    }

                    await userCourseArray.push(userCourseData)
                })
            )

            cronLogData['user_course_data'] = userCourseArray
            cronLogData['amount'] = totalAmount

            let amount = totalAmount

            if(totalAmount > 0){
                let orderId = await findUniqueID()

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

                const createInvoice = await InvoiceModel.createInvoice(invoiceData);

                cronLogData['create_invoice'] = createInvoice

                let invoiceid = createInvoice?._id ? createInvoice?._id.toString() : null

                await userCourseArray.map(async (userelement) => {
                    userelement['invoice_id'] = invoiceid
                    await UserCourseModel.assignUserCourse(userelement);
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
                    convince_fee: courseData?.convince_fee
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

module.exports = {
    addCart,
    getCartsData,
    deleteCartItem,
    checkOut,
    qrCheckOut
}