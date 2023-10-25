const ContactUsService = require("../services/ContactUsService")
const { validateFormFields } = require("./middlewares/validateForm")
const { body } = require("express-validator")

module.exports = async (app) => {
    app.post("/contactUs/addContactUs", async (req, res, next) => {
        const {
            user_id,
            first_name,
            email,
            country_code,
            phone_number,
            subject,
            your_message,
        } = req.body

        const data = await ContactUsService.addContactUs({
            user_id,
            first_name,
            email,
            country_code,
            phone_number,
            subject,
            your_message,
        })

        res.status(data.status_code).json(data)
    })

    app.post(
        "/contactUs/getContactUsList",
        await validateFormFields([
            body("startToken")
                .isNumeric()
                .withMessage("Enter a valid start token value"),

            body("endToken")
                .notEmpty()
                .withMessage("End token is required")
                .isNumeric()
                .withMessage("Enter a valid end token value"),
        ]),
        async (req, res, next) => {
            const { search, startToken, endToken } = req.body

            const data = await ContactUsService.getContactUsList({
                search,
                startToken,
                endToken,
            })

            res.status(data.status_code).json(data)
        }
    )

    app.post(
        "/contactUs/deleteContactUs",
        await validateFormFields([
            body("id")
                .notEmpty()
                .withMessage("Id is required")
                .isMongoId()
                .withMessage("Id is not valid"),
        ]),
        async (req, res, next) => {
            const { id } = req.body

            const data = await ContactUsService.deleteContactUs({ id })

            res.status(data.status_code).json(data)
        }
    )

    app.post(
        "/contactUs/updateContactUs",
        await validateFormFields([
            body("id")
                .notEmpty()
                .withMessage("id is required.")
                .isMongoId()
                .withMessage("id is not valid"),
        ]),
        async (req, res, next) => {
            const {
                id,
                user_id,
                first_name,
                email,
                country_code,
                phone_number,
                subject,
                your_message,
            } = req.body
            const data = await ContactUsService.updateContactUs(
                {
                    id,
                    user_id,
                    first_name,
                    email,
                    country_code,
                    phone_number,
                    subject,
                    your_message,
                },
                req
            )
            res.status(data.status_code).json(data)
        }
    )
}
