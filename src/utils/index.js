const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var validator = require('validator');
var pdf = require('html-pdf');
const axios = require("axios");
const nodemailer = require("nodemailer");
const { SmsLogModel, ApiCallsModel, ConjobLogModel, EmailLogsModel, InvoiceModel, UserModel} = require('../database');
const fs = require('fs');
var ip2location = require('ip-to-location');
const pdfLib = require('pdf-lib');

//Utility functions
module.exports.GenerateSalt = async () => {
	return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
	return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
	enteredPassword,
	savedPassword,
	salt
) => {
	return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
	try {
		return await jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
	} catch (error) {
		console.log(error);
		return error;
	}
};

module.exports.ValidateSignature = async (req) => {
	try {
		const signature = req.get("Authorization");
		if (signature) {
			const payload = await jwt.verify(signature.split(" ")[1], process.env.JWT_SECRET_KEY);
			req.user = payload;
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
};

module.exports.CheckPassword = async (password) => {
	var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
	if (regex.test(password)) {
		return true;
	}
	else {
		return false;
	}
};

module.exports.ValidateEmail = async (email) => {
	let regex = /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/i;
	return regex.test(String(email).toLowerCase());
};

//verify the mobile no
module.exports.ValidateMobileNumber = async (mobileNo) => {
	var regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	if (regex.test(mobileNo)) {
		return true;
	}
	else {
		return false;
	}
}


module.exports.RandomNumber = async (strLength) => {
	var result = '';
	var charSet = '';

	strLength = strLength || 5;
	charSet = '123456789';

	while (strLength--) { // (note, fixed typo)
		result += charSet.charAt(Math.floor(Math.random() * charSet.length));
	}

	return result;
}

//convert date to time stamp
module.exports.DateToTimestamp = async (date) => {
	var datum = Date.parse(date);
	return datum / 1000;
};

module.exports.ValidationMessage = async (validationRules) => {
	let errorArray = []
	validationRules.map((errorList) => {
		if (errorList.check_validation == "empty") {
			if (errorList.field_value == undefined) {
				errorArray.push({
					field_name: errorList.field_name,
					message: errorList.message
				})
			} else if ((isNaN(errorList.field_value) && validator.isEmpty(errorList.field_value)) || (errorList.field_value == '' && errorList.field_value !== 0)) {
				errorArray.push({
					field_name: errorList.field_name,
					message: errorList.message
				})
			}
		}
	});

	return errorArray;
}

//send single sms
module.exports.sendSingleSms = async (country_code, mobile_no, message, template_id, user_id, sms_type) => {

	if (mobile_no && country_code && message) {

		let mobileno = country_code + mobile_no 


		let url = `http://bulksms.saakshisoftware.in/api/mt/SendSMS?user=${process.env.SMS_USER_NAME}&password=${process.env.SMS_PASSWORD}&senderid=${process.env.SMS_SENDERID}&channel=trans&DCS=0&flashsms=0&number=${mobileno}&text=${message}&route=04&DLTTemplateId=${template_id}&PEID=${process.env.SMS_PEID}`


		return await axios.get(encodeURI(url)).then((response) => {
			let responseData = response.data
			if (response && response?.data && response?.data?.ErrorCode && response?.data?.ErrorCode == "000") {

				//sms Log
				SmsLogModel.createSmsLog({
					user_id: user_id,
					send_date: new Date(),
					message_id: responseData?.MessageData?.[0]?.MessageId ? responseData?.MessageData?.[0]?.MessageId : '',
					JobId: responseData?.JobId ? responseData?.JobId : '',
					message: message,
					template_id: template_id,
					to_number: mobileno,
					status: 2,
					sms_response: JSON.stringify(responseData),
					sender_id: process.env.SMS_SENDERID ? process.env.SMS_SENDERID : '',
					sms_type: sms_type
				})

				return true
			} else {
				//sms Log
				SmsLogModel.createSmsLog({
					user_id: user_id,
					send_date: new Date(),
					message_id: responseData?.MessageData?.[0]?.MessageId ? responseData?.MessageData?.[0]?.MessageId : '',
					JobId: responseData?.JobId ? responseData?.JobId : '',
					message: message,
					template_id: template_id,
					to_number: mobileno,
					status: 3,
					sms_response: responseData ? JSON.stringify(responseData) : '',
					sender_id: process.env.SMS_SENDERID ? process.env.SMS_SENDERID : '',
					sms_type: sms_type
				})
				return false
			}
		}).catch((err) => {
			
			//sms Log
			SmsLogModel.createSmsLog({
				user_id: user_id,
				send_date: new Date(),
				message_id: '',
				JobId: '',
				message: message,
				template_id: template_id,
				to_number: mobileno,
				status: 3,
				sms_response: JSON.stringify(responseData),
				sender_id: process.env.SMS_SENDERID ? process.env.SMS_SENDERID : '',
				sms_type: sms_type
			})
			return false
		});
	} else {

		//sms Log
		SmsLogModel.createSmsLog({
			user_id: user_id,
			send_date: new Date(),
			message_id: '',
			JobId: '',
			message: message,
			template_id: template_id,
			to_number: mobile_no,
			status: 3,
			sms_response: JSON.stringify(responseData),
			sender_id: process.env.SMS_SENDERID ? process.env.SMS_SENDERID : '',
			sms_type: sms_type
		})
		return false
	}
}

// create acron job log
module.exports.createCronLogs = async (data) => {
	try {
		let apiCallData = await ConjobLogModel.createConjobLog(data);
		if (apiCallData) {
			return {
				status: true,
				cron_id: apiCallData._id
			}
		} else {
			return {
				status: false,
				cron_id: 0
			}
		}
	} catch (error) {
		return {
			status: false,
			cron_id: 0
		}
	}
}

// update acron job log
module.exports.updateCronLogs = async (id, data) => {
	try {
		let executationTime = Date.now() - data.cronstart_time

		let cronData = await ConjobLogModel.updateConjobLog(id, {
			end_time: data.end_time,
			details: data.details,
			executation_time: executationTime
		});

		if (cronData) {
			return {
				status: true,
				cron_id: id
			}
		} else {
			return {
				status: false,
				cron_id: 0
			}
		}
	} catch (error) {
		return {
			status: false,
			cron_id: 0
		}
	}
}

//create api call log
module.exports.createApiCallLog = async (data) => {
	try {
		let apiCallData = await ApiCallsModel.createApiCall(data);
		if (apiCallData) {
			return {
				status: true,
				api_id: id
			}
		} else {
			return {
				status: false,
				api_id: 0
			}
		}
	} catch (error) {
		return {
			status: false,
			api_id: 0
		}
	}
}

module.exports.getNewDate = async (duration, duration_time) => {
	// Create a new date object
	const date = new Date();

	if (duration == "day") {
		// Add days to the date
		const numberOfDays = duration_time;
		date.setDate(date.getDate() + numberOfDays);
	} else if (duration == "month") {
		// Add months to the date
		const numberOfMonths = duration_time;
		date.setMonth(date.getMonth() + numberOfMonths);
	} else if (duration == "year") {
		// Add years to the date
		const numberOfYears = duration_time;
		date.setFullYear(date.getFullYear() + numberOfYears);
	}

	return date;
}

// send mail
// module.exports.sendMail = async (email, body, subject) => {
// 	let aws = await AWS.config.update({
// 		accessKeyId: process.env.MAIL_AWS_S3_ACCESS_KEY,
// 		secretAccessKey: process.env.MAIL_AWS_S3_SECRET_KEY,
// 		region: process.env.MAIL_AWS_S3_REGION
// 	});

// 	var params = {
// 		Destination: {
// 			ToAddresses: [email]
// 		},
// 		Message: {
// 			Body: {
// 				Html: {
// 					Charset: "UTF-8",
// 					Data: body
// 				}
// 				// Text: {
// 				//  Charset: "UTF-8",
// 				//  Data: message
// 				// }
// 			},
// 			Subject: {
// 				Charset: 'UTF-8',
// 				Data: subject
// 			}
// 		},
// 		Source: process.env.MAIL_AWS_DEFAULT_MAIL
// 	};

	
// 	if (attachments) {
// 		//console.log("Buffer.from(attachment_file, 'base64') :: ", Buffer.from(attachment_file, 'base64'))
// 		params['Attachments'] = [
// 			{
// 				Filename: attachment_file_name,
// 				Content: Buffer.from(attachment_file, 'base64'),
// 				//ContentType: content_type
// 			}
// 		]
// 	}
// 	//console.log("params :: ", params)
// 	// Create the promise and SES service object
// 	var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();

// 	// Handle promise's fulfilled/rejected states
// 	return await sendPromise.then((data) => {
// 		return true
// 	}).catch((err) => {
// 		console.log("error :: ", err)
// 		return false
// 	});
// }

// send mail
module.exports.sendMail = async (email, body, subject, userId, module, attachments = false, attachment_file, file_name) => {
	/* This code is for send mail using AWS SES 
	let aws = await AWS.config.update({
		accessKeyId: process.env.MAIL_AWS_S3_ACCESS_KEY,
		secretAccessKey: process.env.MAIL_AWS_S3_SECRET_KEY,
		region: process.env.MAIL_AWS_S3_REGION
	});

	// Create a Nodemailer transporter using the AWS SES transport
	const transporter = nodemailer.createTransport({
		SES: new AWS.SES({ apiVersion: '2010-12-01' })
	});

	// Compose the email
	const mailOptions = {
		from: process.env.MAIL_AWS_DEFAULT_MAIL,
		to: email,
		subject: subject,
		html: body,
		ses: {
			ConfigurationSetName: "Testingemails"
		}
	};

	if(attachments){
		mailOptions['attachments'] = [
			{
				filename: file_name,
				path: attachment_file // Replace with the actual file path
			}
		]
	}

	// Send the email
	const info = await transporter.sendMail(mailOptions).then((data) => {
		EmailLogsModel.createEmailLog({
			user_id: userId,
			message_id: data.response,
			from: process.env.MAIL_AWS_DEFAULT_MAIL,
			to: email,
			subject,
			module,
			response: JSON.stringify(data),
		});
		return data
	}).catch((err) => {
		console.log(err);
		return false
	});
	
	return info; */
	const transporter = nodemailer.createTransport({
		host: process.env.MAIL_SMTP_HOST, // Your SMTP server hostname
		port: process.env.MAIL_SMTP_PORT, // Port for SMTP
		secure: false, // Set to true if you're using TLS/SSL
		auth: {
			user: process.env.MAIL_SMTP_USER, // Your email address
			pass: process.env.MAIL_SMTP_PASSWORD // Your email password
		}
	});
	//console.log('transporter :: ',transporter);
	// Email details
	const mailOptions = {
		from: process.env.MAIL_SMTP_FROM, // Sender email
		to: email,
		subject: subject,
		html: body,
	};

	if(attachments){
		mailOptions['attachments'] = [
			{
				filename: file_name,
				path: attachment_file // Replace with the actual file path
			}
		]
	}
	//console.log('mailOptions :: ',mailOptions);
	// console.log('mailOptions:: ',mailOptions);
	try{
		transporter.sendMail(mailOptions).then( (info) => {
			if(info){
				EmailLogsModel.createEmailLog({
					user_id: userId,
					message_id: info.messageId,
					from: process.env.MAIL_SMTP_FROM, 
					message: body,
					to: email,
					subject,
					module,
					response: JSON.stringify(info),
				});
			}

			if(attachments){
				if (fs.existsSync(attachment_file)) {
					fs.unlinkSync(attachment_file);
				}
			}

			return true
		});

		return true
	}catch(err){
		console.log('err :: ',err);
		return false;
	}
}

module.exports.generatePDF = async (body, pdfName) => {
	//Tabloid
	// const options = { format: 'A4', type: 'pdf',  quality: "30" };

	// const pdfBuffer = await new Promise((resolve, reject) => {
	// 	pdf.create(body, options).toBuffer(async (err, buffer) => {
	// 	  if (err) {
	// 		reject(err);
	// 	  } else {

	// 		const pdfDoc = await pdfLib.PDFDocument.load(buffer);
  	// 		const compressedBuffer = await pdfDoc.save();
  
	// 		fs.writeFileSync('uploads/' + pdfName, compressedBuffer);
	// 		resolve(buffer);
	// 	  }
	// 	});
	//   });


	// return true;
	const options = { format: 'A4',
		childProcessOptions: {
			env: {
			OPENSSL_CONF: '/dev/null',
			},
		}
	};
	return await new Promise(async (resolve, reject) => {
		await pdf.create(body, options).toFile('./uploads/'+pdfName, function (err, res) {
			if (err){ 
				console.log("pdf error: ::", err)
				resolve(false)
			}else{ 
				//console.log("pdf res: ::", res) 
				resolve(true)
			};
		});
	})
	
	// setTimeout(async () => {
    //     const doc = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })

    //     const pfWidth = doc.internal.pageSize.getWidth()
    //       doc.html(body, {
    //         width: pfWidth,
    //         windowWidth: 445,
    //         margin: [40, 0, 0, 0],
    //       })
	// 	await doc.save('uploads/'+pdfName)
    //   }, 1000)
}

//generate random String
module.exports.randomString = async (strLength) => {
	var result = '';
	var charSet = '';

	strLength = strLength || 5;
	charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	while (strLength--) { // (note, fixed typo)
		result += charSet.charAt(Math.floor(Math.random() * charSet.length));
	}

	return result;
}

module.exports.sendPushNotification = async (requestData) => {

	const { notification_device_id, message, template_id, notificationdata, device_type } = requestData;

	const appId = device_type == "ios" ?  process.env.IOS_ONE_SIGNAL_APP_ID : process.env.ONE_SIGNAL_APP_ID;
	const apiKey = device_type == "ios" ? process.env.IOS_ONE_SIGNAL_API_KEY : process.env.ONE_SIGNAL_API_KEY;

	const notificationData = {
		app_id: appId,
		contents: { en: message },
		include_player_ids: notification_device_id,
	};

	if(template_id){
		notificationData['template_id'] = template_id
	}

	if(notificationdata){
		notificationData['data'] = notificationdata
	}
	//console.log('notificationData :: ',notificationData);
	try {
		const response = await axios.post('https://onesignal.com/api/v1/notifications', notificationData, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic ${apiKey}`,
			}
		});
		//console.log('Notification has been sent successfully:', response.data);
		return {
			status: true,
			response: response.data,
			message: "Notification has been sent successfully"
		}
	} catch (error) {
		console.error('Error while sending sending notification:', error.response.data);
		return {
			status: false,
			response: error.response.data,
			message: "Notification failed."
		}
	}
}

module.exports.GetUserLocation = async (ip) => {
	let locationData = ip2location.fetch(ip).then(res => {
		return res;
	});
	return locationData;
}

module.exports.findUniqueID = async () => {
	let isUnique = false;
	let uniqueId;
  
	while (!isUnique) {
	  uniqueId = this.randomString(15);
	  const existingDoc = await InvoiceModel.findOrderData(uniqueId);
  
	  if (!existingDoc) {
		isUnique = true;
	  }
	}
  
	return uniqueId;
}

  module.exports.encryptDecryptString = async (string, type = 0) => {
	try {
        const crypto = require('crypto');
        const algorithm = 'aes-256-ctr';
        const ENCRYPTION_KEY = 'd1e8a70b5ccab1dc2f56bbf7e99f064a660c08e361a35751b9c483c88943d082';
        const IV_LENGTH = 16;

		if(type == 0){
			let iv = crypto.randomBytes(IV_LENGTH);
            let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
            let encrypted = cipher.update(string);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return iv.toString('hex') + ':' + encrypted.toString('hex');
		}else{
			let textParts = string.split(':');
            let iv = Buffer.from(textParts.shift(), 'hex');
            let encryptedText = Buffer.from(textParts.join(':'), 'hex');
            let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
		}
	} catch (error) {
		console.log('encryption error', error);
	}
}

module.exports.millisecToTime = async (millisec) => {
	if(millisec != 0){
		var seconds = (millisec / 1000).toFixed(0);
		var minutes = Math.floor(seconds / 60);
		var hours = "";
		if (minutes > 59) {
			hours = Math.floor(minutes / 60);
			hours = (hours >= 10) ? hours : "0" + hours;
			minutes = minutes - (hours * 60);
			minutes = (minutes >= 10) ? minutes : "0" + minutes;
		}
	
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		if (hours != "") {
			return hours + ":" + minutes + ":" + seconds;
		}
		return "00:"+ minutes + ":" + seconds;
	}else{
		return "00:00:00";
	}
	
}

module.exports.findUserReferralCode = async () => {
	let isUnique = false;
	let uniqueId;
  
	while (!isUnique) {
	  uniqueId = this.randomString(8);
	  const existingDoc = await UserModel.fatchUserfilterData({ user_referral_code: uniqueId });
  
	  if (!existingDoc) {
		isUnique = true;
	  }
	}
  
	return uniqueId;
}

module.exports.invoiceYear = async () => {
	const currentYear = new Date().getFullYear();
	const lastTwoYearDigits = parseInt(currentYear.toString().slice(-2)) + 1;

	return `${currentYear}-${lastTwoYearDigits}`
}

module.exports.generateInvoiceNumber = async (invoiceCounter) => {
	let invoiceNumber = String(invoiceCounter+1).padStart(4, '0');

	invoiceNumber = "1" + invoiceNumber
	return invoiceNumber
}
