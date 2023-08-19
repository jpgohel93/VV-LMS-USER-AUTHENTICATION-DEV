const ContactUsService = require("../services/ContactUsService")


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
}
