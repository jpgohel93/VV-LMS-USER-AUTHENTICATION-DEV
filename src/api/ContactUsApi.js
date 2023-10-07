const ContactUsService = require("../services/ContactUsService")
const { validateFormFields } = require("./middlewares/validateForm")
const { body } = require("express-validator")

module.exports = async (app) => {
    app.post("/contactUs/addContactUs", async (req, res, next) => {
        const { first_name, email, subject, your_message } = req.body

        const data = await ContactUsService.addContactUs({
            first_name,
            email,
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
}
