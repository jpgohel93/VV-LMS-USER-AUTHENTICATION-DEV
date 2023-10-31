const { FeedbackSchema } = require('../schema');

const storeFeedback = async (insertData) => {

    const feedback = new FeedbackSchema(insertData)

    const feedbackResult = await feedback.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return feedbackResult;
}

const updateFeedback = async (updateData, feedback_id) => {

    const invoiceResult =  await FeedbackSchema.updateOne({_id: feedback_id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return invoiceResult;
}

const fetchFeedbackData = async (start, limit, course_id) => {
    const feedbackData = await FeedbackSchema.find({ course_id: course_id }).populate({
        path: 'user_id',
        select: ['first_name','last_name','profile_image','email','country_code','mobile_no']
      }).sort({ createdAt: -1 }).skip(start).limit(limit).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return feedbackData;
}

const removeFeedbackData = async (id) => {

    const cartData = await FeedbackSchema.deleteOne({_id: id }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return cartData;
}

module.exports = {
    storeFeedback,
    updateFeedback,
    fetchFeedbackData,
    removeFeedbackData
}