const { UserCourseModel, InvoiceModel, PaymentWebhookModel, UserModel, PaymentLogsModel } = require("../../database");
const { CallCourseQueryEvent } = require('../../utils/call-event-bus');
const { courseSubscription, renewedCourseSubscription, subscriptionCancelTemplate } = require('../../utils/email-template');
const { invoiceTemplate } = require('../../utils/pdf-template');
const { sendMail, generatePDF, getNewDate, sendMailWithAttachment } = require('../../utils');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
 
module.exports = (app) => {
    app.all("/payment/webhook", async (req, res) => {

        const requestData = req.body;
        // const requestData = {"entity":"event","account_id":"acc_Ak8zzin9J43uMU","event":"subscription.charged","contains":["subscription","payment"],"payload":{"subscription":{"entity":{"id":"sub_M4qwjWDYYxW6wF","entity":"subscription","plan_id":"plan_M4qkPXR3uhQVmy","customer_id":"cust_LyCpufcYdjLW08","status":"active","current_start":1687410143,"current_end":1689964200,"ended_at":null,"quantity":1,"notes":{"reference_id":""},"charge_at":1689964200,"start_at":1687410143,"end_at":4840367400,"auth_attempts":0,"total_count":1200,"paid_count":1,"customer_notify":true,"created_at":1687410124,"expire_by":null,"short_url":null,"has_scheduled_changes":false,"change_scheduled_at":null,"source":"api","payment_method":"card","offer_id":null,"remaining_count":1199}},"payment":{"entity":{"id":"pay_M4qx3b9HtL0Lry","entity":"payment","amount":230000,"currency":"INR","status":"captured","order_id":"order_M4qwk3pN9te2mO","invoice_id":"inv_M4qwk1HKtI2agR","international":false,"method":"card","amount_refunded":0,"amount_transferred":0,"refund_status":null,"captured":"1","description":null,"card_id":"card_M4qx3oM6DsVr0w","card":{"id":"card_M4qx3oM6DsVr0w","entity":"card","name":"","last4":"5449","network":"MC","type":"credit","issuer":"UTIB","international":false,"emi":false,"expiry_month":"01","expiry_year":"2099","sub_type":"consumer","token_iin":null,"number":"**** **** **** 5449","color":"#25BAC3"},"bank":null,"wallet":null,"vpa":null,"email":"jayrank@tjcg.in","contact":"+917046810027","customer_id":"cust_LyCpufcYdjLW08","token_id":"token_M4qx43rN1IIXRJ","notes":[],"fee":7870,"tax":1200,"error_code":null,"error_description":null,"acquirer_data":{"auth_code":"805576"},"created_at":1687410143}}},"created_at":1687410233};
        if(requestData && requestData?.event){
            if(requestData?.event == "subscription.activated"){
                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "subscription activated"
                })
                let logData = {}
                //payment log end
                
                // active the subscription
                let subscriptionData= requestData?.payload?.subscription?.entity
                if(subscriptionData?.id){
                    let subscriptionId = subscriptionData?.id

                    logData['subscription_id'] = subscriptionId

                    const userCourseData = await UserCourseModel.getUserBySubscriptionId(subscriptionId);

                    logData['user_id'] = userCourseData.user_id
                    logData['user_course_data'] = JSON.stringify(userCourseData)

                    await UserCourseModel.updateUserCourse(userCourseData._id,{
                        is_deleted: false
                    })
                }

               //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
                
            }else if(requestData?.event == "order.paid"){

                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "order paid"
                })
                let logData = {}
                //payment log end

                let paymentData = requestData?.payload?.payment?.entity
                let orderData = requestData?.payload?.order?.entity

                if(paymentData && orderData){
                    let invoice_id = orderData?.invoice_id;
                    let order_id = paymentData?.order_id;

                    logData['invoice_id'] = invoice_id
                    logData['order_id'] = order_id

                    const invoiceData = await InvoiceModel.findOrderById(order_id);
                    if(invoiceData){
                        await InvoiceModel.updateInvoice(invoiceData._id, { invoice_id: invoice_id, payment_status: 2 }); //Update invoice payment status to paid
                    }
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "payment.captured"){

                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "payment captured"
                })
                let logData = {}
                //payment log end

                let paymentData = requestData?.payload?.payment?.entity

                if(paymentData){
                    let invoice_id = paymentData?.invoice_id;
                    let order_id = paymentData?.order_id;

                    logData['invoice_id'] = invoice_id
                    logData['order_id'] = order_id

                    const invoiceData = await InvoiceModel.findOrderById(order_id);
                    if(invoiceData){
                        await InvoiceModel.updateInvoice(invoiceData._id, { invoice_id: invoice_id, payment_status: 2 }); //Update invoice payment status to paid
                    }
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "payment.failed"){

                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "payment failed"
                })
                let logData = {}
                //payment log end

                let paymentData = requestData?.payload?.payment?.entity
                if(paymentData){
                    let invoice_id = paymentData?.invoice_id;
                    let order_id = paymentData?.order_id;

                    logData['invoice_id'] = invoice_id
                    logData['order_id'] = order_id

                    const invoiceData = await InvoiceModel.findOrderById(order_id);
                    if(invoiceData){
                        await InvoiceModel.updateInvoice(invoiceData._id, {invoice_id: invoice_id, payment_status: 3 }); //Update invoice payment status to failed
                    }
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "refund.created"){
                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "refund created"
                })
                let logData = {}
                //payment log end

                let paymentData = requestData?.payload?.payment?.entity
                if(paymentData){
                    let invoice_id = paymentData?.invoice_id;

                    logData['invoice_id'] = invoice_id

                    const invoiceData = await InvoiceModel.findInvoiceById(invoice_id);
                    if(invoiceData){
                        await InvoiceModel.updateInvoice(invoiceData._id, { payment_status: 7 }); //Update invoice payment status to refund created status
                    }
                }

                 //payment update log start
                 if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "refund.processed"){

                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "refund processed"
                })
                let logData = {}
                //payment log end

                let paymentData = requestData?.payload?.payment?.entity

                if(paymentData){
                    let invoice_id = paymentData?.invoice_id;
                    
                    logData['invoice_id'] = invoice_id

                    const invoiceData = await InvoiceModel.findInvoiceById(invoice_id);
                    if(invoiceData){
                        await InvoiceModel.updateInvoice(invoiceData._id, { payment_status: 5 }); //Update invoice payment status to refund processed status
                    }
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "refund.failed"){
                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "refund failed"
                })
                let logData = {}
                //payment log end

                let paymentData = requestData?.payload?.payment?.entity

                if(paymentData && orderData){
                    let invoice_id = paymentData?.invoice_id;

                    logData['invoice_id'] = invoice_id

                    const invoiceData = await InvoiceModel.findInvoiceById(invoice_id);
                    if(invoiceData){
                        await InvoiceModel.updateInvoice(invoiceData._id, { payment_status: 8 }); //Update invoice payment status to refund failed status
                    }
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "invoice.paid"){
                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "invoice paid"
                })
                let logData = {}
                //payment log end

                let paymentData = requestData?.payload?.payment?.entity
                let orderData = requestData?.payload?.order?.entity

                if(paymentData && orderData){
                    let invoice_id = paymentData?.invoice_id;

                    logData['invoice_id'] = invoice_id

                    const invoiceData = await InvoiceModel.findInvoiceById(invoice_id);
                    if(invoiceData){
                        await InvoiceModel.updateInvoice(invoiceData._id, { payment_status: 2 }); //Update invoice payment status to paid
                    }
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "subscription.charged"){

                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "subscription charged"
                })
                let logData = {}
                //payment log end

                let paymentData= requestData?.payload?.payment?.entity
                let subscriptionData= requestData?.payload?.subscription?.entity

                if(paymentData && subscriptionData){
                    const subscriptionId = subscriptionData.id;
                    const userCourseData = await UserCourseModel.getUserBySubscriptionId(subscriptionId);
                    if(userCourseData){
                        const userData = await UserModel.fatchUserById(userCourseData.user_id);
                        const userId = userCourseData.user_id;
                        const courseId = userCourseData.course_id;
                        const amount = paymentData?.amount ? (parseFloat(paymentData?.amount) / 100) : 0;
                        const invoiceType = subscriptionData?.paid_count > 1 ? "3" : '1';
                        let invoice_id = paymentData?.invoice_id;

                        logData['user_id'] = userCourseData.user_id
                        logData['user_course_data'] = JSON.stringify(userCourseData)
                        logData['subscription_id'] = subscriptionId
                        logData['invoice_id'] = invoice_id
                        logData['order_id'] = paymentData?.order_id

                        let createInvoiceData = {
                            user_id: userId, 
                            course_id: courseId,
                            reference_id: userCourseData._id,
                            invoice_id: invoice_id,
                            payment_id: paymentData?.id,
                            order_id: paymentData?.order_id,
                            course_type: 'N/A',
                            amount: amount,
                            purchase_time: new Date(),
                            subscription_id: subscriptionId,
                            invoice_type: invoiceType,
                            title: "Subscription Charged",
                            payment_method: paymentData?.method,
                            module_name: "Webhook",
                            payment_status: 2,
                            invoice_type: 3,
                            is_send_mail: true
                        }
                        const createInvoice = await InvoiceModel.createInvoice(createInvoiceData);

                        let subscription_recurring_date = new Date()
                        if(userCourseData.duration == 'month'){
                            // Create a new date object
                            const date = await getNewDate("month", 1)

                            subscription_recurring_date = date
                        }else if(userCourseData.duration == 'quarter'){
                            // Create a new date object
                            const date = await getNewDate("month", 3)

                            subscription_recurring_date = date
                        }else if(userCourseData.duration == 'year'){
                            // Create a new date object
                            const date = await getNewDate("year", 1)

                            subscription_recurring_date = date
                        }else if(userCourseData.duration == "two-year"){
                            // Create a new date object
                            const date = await getNewDate("year", 2)

                            subscription_recurring_date = date
                        }

                        //update user course data
                        await UserCourseModel.updateUserCourse(userCourseData._id,{
                            payment_status: 2,
                            is_purchase: true,
                            subscription_date: new Date(),
                            subscription_recurring_date: subscription_recurring_date
                        })

                        //send mail over hear
                        //send subscription mail with invoice mail
                        if(userData?.email){
                            let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: userCourseData?.course_id  },' ')
                            const pdfName = invoice_id+".pdf";
                            await new Promise(async (resolve, reject) => {
                                const invoiceData = {
                                    status: 'paid',
                                    amount: amount,
                                    username: `${userData.first_name} ${userData.last_name}`,
                                    issue_data: moment(new Date()).format('MMMM.Do.YYYY'),
                                    due_date: moment(new Date()).format('MMMM.Do.YYYY'),
                                    course:[{
                                        course_title: courseData?.course_title || "",
                                        amount: amount
                                    }]
                                };
                                const pdfBody = await invoiceTemplate(invoiceData);
                                const result = await generatePDF(pdfBody, pdfName);
                                if(result){
                                    resolve(true)
                                }
                            })

                            let link = ''
                            if(process.env.DEVELOPER_MODE == "development"){
                                link = process.env.LOGIN_LINK_LOCAL
                            }else{
                                link = process.env.LOGIN_LINK_LIVE
                            }
                            let email = userData?.email
                            let courseName = courseData && courseData?.course_title ? courseData?.course_title : '' 
                            let username = (userData?.first_name ? userData?.first_name : '') + " " + (userData?.last_name ? userData?.last_name : '')

                            let message = "";
                            let subject = "";
                            if(userCourseData?.is_send_mail){
                                subject = `Subscription Confirmation for ${courseName}`;
                                message = await courseSubscription({ user_name: username, id: email, link: link, subject: subject, course_name: courseName});

                                await UserCourseModel.updateUserCourse(userCourseData._id,{
                                    is_send_mail: true
                                })
                            }else{
                                subject = `Subscription Confirmation for ${courseName}`;
                                message = await renewedCourseSubscription({ user_name: username, id: email, link: link, subject: subject, course_name: courseName});

                                await UserCourseModel.updateUserCourse(userCourseData._id,{
                                    is_send_mail: true
                                })
                            }
                            
                            let filePath = 'uploads/'+pdfName;

                            //send subscription invoice mail
                            let sendwait = await sendMail(email, message, subject, userCourseData.user_id, "Webhook(subscription.charged)", true, filePath, pdfName)
                            if(sendwait){
                                if (fs.existsSync('uploads/'+pdfName)) {
                                    fs.unlinkSync('uploads/'+pdfName);
                                }
                            }

                        }
                    }
                } 


               //payment update log start
               if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "subscription.cancelled"){

                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "subscription cancelled"
                })
                let logData = {}
                //payment log end

                // if user cancle the subscription 
                let subscriptionData= requestData?.payload?.subscription?.entity
                if(subscriptionData?.id){
                    let subscriptionId = subscriptionData?.id
                    const userCourseData = await UserCourseModel.getUserBySubscriptionId(subscriptionId);

                    if(userCourseData){
                        const userData = await UserModel.fatchUserById(userCourseData.user_id);
    
                        logData['subscription_id'] = subscriptionId
                        logData['user_id'] = userCourseData.user_id
                        logData['user_course_data'] = JSON.stringify(userCourseData)
    
                        await UserCourseModel.updateUserCourse(userCourseData._id,{
                            is_deleted: true,
                            subscription_cancle_date: new Date(),
                            is_cancle_subscription: true
                        })

                        //send mail for cancel subscription
                        if(userData?.email){
                            let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: userCourseData?.course_id  },' ')
                       
                            let link = ''
                            if(process.env.DEVELOPER_MODE == "development"){
                                link = process.env.LOGIN_LINK_LOCAL
                            }else{
                                link = process.env.LOGIN_LINK_LIVE
                            }
                            let email = userData?.email
                            let courseName = courseData && courseData?.course_title ? courseData?.course_title : '' 
                            let username = (userData?.first_name ? userData?.first_name : '') + " " + (userData?.last_name ? userData?.last_name : '')

                            let message = await subscriptionCancelTemplate({ user_name: username, id: email, link: link, subject: subject, course_title: courseName});
                            let subject = `Course Subscription Cancellation for ${courseName}`;
                            //send cancel subscription mail
                            let sendwait = await sendMail(email, message, subject, userCourseData.user_id, "Webhook(subscription.cancelled)")

                        }
                    }
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "subscription.pending"){

                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "subscription pending"
                })
                let logData = {}
                //payment log end

                 //payment is not receive from  the bank or card
                let subscriptionData= requestData?.payload?.subscription?.entity

                if(subscriptionData?.id){
                    let subscriptionId = subscriptionData?.id
                    const userCourseData = await UserCourseModel.getUserBySubscriptionId(subscriptionId);

                    if(userCourseData){
                        const userData = await UserModel.fatchUserById(userCourseData.user_id);

                        logData['subscription_id'] = subscriptionId
                        logData['user_id'] = userCourseData.user_id
                        logData['user_course_data'] = JSON.stringify(userCourseData)
    
    
                        let createInvoiceData = {
                            user_id: userId, 
                            course_id: courseId,
                            reference_id: userCourseData._id,
                            payment_id: null,
                            order_id: null,
                            course_type: 'N/A',
                            amount: userCourseData.price,
                            purchase_time: new Date(),
                            subscription_id: subscriptionId,
                            invoice_type: 3,
                            title: "Subscription Charged",
                            payment_method: null,
                            module_name: "Webhook",
                            payment_status: 3
                        }
                        await InvoiceModel.createInvoice(createInvoiceData);
    
                        //send mail over hear
                        //send subscription mail with invoice mail
                        if(userData?.email){
                            let courseData = await CallCourseQueryEvent("get_course_data_without_auth",{ id: userCourseData?.course_id  },' ')
                            const pdfName = invoice_id+".pdf";
                            await new Promise(async (resolve, reject) => {
                                const invoiceData = {
                                    status: 'failed',
                                    amount: amount,
                                    username: `${userData.first_name} ${userData.last_name}`,
                                    issue_data: moment(new Date()).format('MMMM.Do.YYYY'),
                                    due_date: moment(new Date()).format('MMMM.Do.YYYY'),
                                    course:[{
                                        course_title: courseData?.course_title || "",
                                        amount: amount
                                    }]
                                };
                                const pdfBody = await invoiceTemplate(invoiceData);
                                const result = await generatePDF(pdfBody, pdfName);
                                if(result){
                                    resolve(true)
                                }
                            })
                        
                            let email = userData?.email
                            let courseName = courseData && courseData?.course_title ? courseData?.course_title : '' 
                            let username = (userData?.first_name ? userData?.first_name : '') + " " + (userData?.last_name ? userData?.last_name : '')

                            let subject = `Subscription Payment Failed For ${courseName}`;
                            let filePath = 'uploads/'+pdfName;

                            //send subscription invoice mail
                            let sendwait = await sendMail(email, "", subject, userCourseData.user_id, "Webhook(subscription.pending)", true, filePath, pdfName)

                            if(sendwait){
                                if (fs.existsSync('uploads/'+pdfName)) {
                                    fs.unlinkSync('uploads/'+pdfName);
                                }
                            }
                        }
                    }
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
               
            }else if(requestData?.event == "subscription.paused"){

                //payment log start
                let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "subscription paused"
                })
                let logData = {}
                //payment log end

                // paused the subscription
                let subscriptionData= requestData?.payload?.subscription?.entity
                if(subscriptionData?.id){
                    let subscriptionId = subscriptionData?.id
                    const userCourseData = await UserCourseModel.getUserBySubscriptionId(subscriptionId);

                    logData['subscription_id'] = subscriptionId
                    logData['user_id'] = userCourseData.user_id
                    logData['user_course_data'] = JSON.stringify(userCourseData)

                    await UserCourseModel.updateUserCourse(userCourseData._id,{
                        is_deleted: true
                    })
                }

                //payment update log start
                if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }else if(requestData?.event == "subscription.resumed"){

                 //payment log start
                 let logId = await PaymentLogsModel.createPaymentLogs({
                    start_time: new Date(),
                    event: requestData?.event,
                    response: JSON.stringify(requestData),
                    log_type: "subscription resumed"
                })
                let logData = {}
                //payment log end

                // resumed the subscription
                let subscriptionData= requestData?.payload?.subscription?.entity
                if(subscriptionData?.id){
                    let subscriptionId = subscriptionData?.id
                    const userCourseData = await UserCourseModel.getUserBySubscriptionId(subscriptionId);

                    logData['subscription_id'] = subscriptionId
                    logData['user_id'] = userCourseData.user_id
                    logData['user_course_data'] = JSON.stringify(userCourseData)

                    await UserCourseModel.updateUserCourse(userCourseData._id,{
                        is_deleted: false
                    })
                }

                 //payment update log start
                 if(logId?._id){
                    logData['end_time'] = new Date()

                    await PaymentLogsModel.updatePaymentLogs(logId?._id, logData)
                }
                //payment update log end
            }

            //console.log('requestData :: ',requestData);
            //create a webhook log
            await PaymentWebhookModel.saveWebhookResponse({ 
                type: requestData?.event,
                requestData: JSON.stringify(requestData)
            })
        }
       
        res.status(200).json({status: true});
    });

    app.all("/payment/ccAveWebhook", async (req, res) => {
        let requestData = JSON.stringify(req.body);
        requestData += "\n --------------------"+new Date()+"------------------------ \n";
        await fs.appendFileSync('uploads/ccAveWebhook.txt',requestData);

        res.status(200).json({
            message: "Cron working"
        });
    });
}