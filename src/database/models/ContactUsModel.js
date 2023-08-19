const { ContactUsSchema } = require("../schema")

const createContactUs = async (insertData) => {
    const contactUs = new ContactUsSchema(insertData)

    const contactUsResult = await contactUs
        .save()
        .then((data) => {
            return data
        })
        .catch((err) => {
            return false
        })

    return contactUsResult
}

module.exports = {
    createContactUs,
}
