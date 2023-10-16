const { ContactUsModel } = require("../database")
const constants = require("../utils/constant")
const { contactUsInquirySubmission } = require("../utils/email-template")
const { sendMail } = require("../utils")

const addContactUs = async (userInputs) => {
    try {
        const { user_id, first_name, email, subject, your_message } = userInputs
        const createContactUs = await ContactUsModel.createContactUs({
            user_id,
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

        let emailSub = "Contact Us Inquire Has Been Received"
        let message = await contactUsInquirySubmission({
            user_name: first_name,
            id: email,
            email: emailSub,
            subject: subject,
            your_message: your_message,
        })
        let sendwait = sendMail(
            process.env.MAIL_SMTP_FROM,
            message,
            emailSub,
            "",
            "Contact US Inquiry Mail"
        )

        return {
            status: true,
            message:
                "Your message has been received! We'll be in touch shortly.",
            status_code: constants.SUCCESS_RESPONSE,
            data: createContactUs,
        }
    } catch (error) {
        console.error("addContactUs error:", error)
        return {
            status: false,
            status_code: constants.ERROR_RESPONSE,
            message:
                "Sorry, we're experiencing technical difficulties at the moment. Please try again later.",
            error: error,
        }
    }
}

const getContactUsList = async (userInputs) => {
    try {
        const { search, startToken, endToken } = userInputs

        const perPage = parseInt(endToken) || 10
        let page = Math.max((parseInt(startToken) || 1) - 1, 0)
        if (page !== 0) {
            page = perPage * page
        }

        const getContactUsdata = await ContactUsModel.fatchContactUsList(
            search,
            page,
            perPage
        )
        const countContactUs = await ContactUsModel.countContactUs(search)

        if (getContactUsdata !== null) {
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "Data retrieved successfully",
                data: getContactUsdata,
                record_count: countContactUs,
            }
        } else {
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "No data found",
                data: null,
                record_count: 0,
            }
        }
    } catch (error) {
        // Handle unexpected errors
        console.error("Unexpected error detected :: ", error)
        return {
            status: false,
            status_code: constants.ERROR_RESPONSE,
            message: "An unexpected error occurred",
            error: { server_error: "An unexpected error occurred" },
            data: null,
        }
    }
}

const deleteContactUs = async (userInputs) => {
    try {
        const { id } = userInputs

        const deleteContactUs = await ContactUsModel.updateContactUs(id, {
            is_deleted: true,
        })

        if (deleteContactUs) {
            return {
                status: true,
                status_code: constants.SUCCESS_RESPONSE,
                message: "contactUs deleted successfully",
            }
        } else {
            return {
                status: false,
                status_code: constants.DATABASE_ERROR_RESPONSE,
                message: "Failed to delete contactUs",
            }
        }
    } catch (error) {
        console.error("Unexpected error detected :: ", error)
        return {
            status: false,
            status_code: constants.ERROR_RESPONSE,
            message: "Failed to add feedback data.",
            error: { server_error: "An unexpected error occurred" },
            data: null,
        }
    }
}

module.exports = {
    addContactUs,
    getContactUsList,
    deleteContactUs,
}
