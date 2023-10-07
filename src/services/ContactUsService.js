const { ContactUsModel } = require("../database")
const constants = require("../utils/constant")
const { contactUsInquirySubmission } = require('../utils/email-template');
const { sendMail } = require('../utils');

const addContactUs = async (userInputs) => {
    try {
        const { first_name, email, subject, your_message } = userInputs
        const createContactUs = await ContactUsModel.createContactUs({
            first_name,
            email,
            subject,
            your_message,
        })

        if (!createContactUs) {
            return {
                status: false,
                status_code: constants.ERROR_RESPONSE,
                message: "Failed to add contactUs",
            }
        }

        let emailSub = "Contact Us Inquire Has Been Received";
        let message = await contactUsInquirySubmission({ user_name: first_name, id: email, email: emailSub, subject: subject, your_message:your_message});
        let sendwait = sendMail(process.env.MAIL_SMTP_FROM, message, emailSub, "", "Contact US Inquiry Mail");
        
        return {
            status: true,
            message: "Your message has been received! We'll be in touch shortly.",
            status_code: constants.SUCCESS_RESPONSE,
            data: createContactUs,
        }
    } catch (error) {
        console.error("addContactUs error:", error)
        return {
            status: false,
            status_code: constants.ERROR_RESPONSE,
            message: "Sorry, we're experiencing technical difficulties at the moment. Please try again later.",
            error: error,
        }
    }
}

module.exports = {
    addContactUs,
}
