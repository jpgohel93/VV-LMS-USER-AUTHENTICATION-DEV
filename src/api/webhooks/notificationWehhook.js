const fs = require('fs');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const { welcomeTemplate } = require('../../utils/email-template');
const { sendMail } = require('../../utils');
const { EmailLogsModel } = require("../../database");
const { CallAdminEvent } = require('../../utils/call-event-bus');

/* const credentials = new AWS.SharedIniFileCredentials({profile: 'sns_profile'});
const sns = new AWS.SNS({credentials: credentials, region: 'eu-west-2'}); */
AWS.config.update({
    accessKeyId: process.env.MAIL_AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.MAIL_AWS_S3_SECRET_KEY,
    signatureVersion: 'v4',
    region: process.env.MAIL_AWS_S3_REGION,
});
var sns = new AWS.SNS();

module.exports = (app) => {
    app.all("/email/webhook", bodyParser.text(), async (req, res) => {
        const { messageId } = req.body.mail;
        if(messageId){
            const emailLogData = await EmailLogsModel.findEmailLogById(messageId);
            if(emailLogData){
                let status = req.body.eventType;
                let messageStatus = 2
                if(status == "Delivery"){
                    status = "Delivered";
                    messageStatus = 3
                }else if(status == "Send"){
                    messageStatus = 1
                    status = "Sending";
                }else if(status == "Open"){
                    status = "Opened";
                }
                const emailLogId = (emailLogData._id).toString();
                await EmailLogsModel.updateEmailLog(emailLogId, {status: status, response: JSON.stringify(response)});

                if(emailLogData.module == "Email Campaign" && emailLogData?.reference_id && status !== "Open"){
                    let reference_id = emailLogData.reference_id
                    await CallCourseQueryEvent("update_email_log",{ reference_id: reference_id, response: JSON.stringify(emailLogData), status: messageStatus  },' ')
                }
            }
        }
    });

    app.all("/email/subscribe", async (req, res) => {
        let params = {
            Protocol: 'HTTPS', 
            TopicArn: 'arn:aws:sns:ap-south-1:379034229131:Email',
            Endpoint: 'https://d1d9-103-105-234-242.ngrok-free.app/email/webhook'
        };
    
        sns.subscribe(params, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
                res.send(data);
            }
        });
    });

    app.all("/email/sendTestEmail", async (req, res) => {
        let subject = "Welcome to Virtual Vidhyapith LMS - Unlock Your Learning Potential!!";
        let message = await welcomeTemplate({ user_name: "Testing TJCG", subject: subject});
        let sendwait = await sendMail('jayrank@tjcg.in', message, subject, "safsterwyerty", "Testing");
        //console.log('sendwait :: ',sendwait)
    });
}