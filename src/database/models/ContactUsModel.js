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

const fatchContactUsList = async (search, start, limit) => {
    let searchFilter = {}
    if (search) {
        searchFilter = {
            $or: [
                { first_name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }
    }

    const contactUsData = await ContactUsSchema.find(searchFilter)
        .select('-__v -updatedAt')
        .skip(start)
        .limit(limit)
        .then((data) => {
            return data
        })
        .catch((err) => {
            console.error(err)
            return null
        })

    return contactUsData
}

const countContactUs = async (search) => {
    let searchFilter = {}
    if (search) {
        searchFilter = {
            $or: [
                { first_name: { $regex: ".*" + search + ".*", $options: "i" } },
                { email: { $regex: ".*" + search + ".*", $options: "i" } },
            ],
        }
    }

    const contactUsData = await ContactUsSchema.count(searchFilter)
        .then((count) => {
            return count
        })
        .catch((err) => {
            return null
        })
    return contactUsData
}

module.exports = {
    createContactUs,
    fatchContactUsList,
    countContactUs,
}
