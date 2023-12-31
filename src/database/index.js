// database related modules
module.exports = {
    databaseConnection: require("./connection"),
    UserModel: require("./models/UserModel"),
    CartModel: require("./models/CartModel"),
    UserCourseModel: require("./models/UserCourseModel"),
    CourseWatchHistoryModel: require("./models/CourseWatchHistoryModel"),
    UserMobileActivityModel: require("./models/UserMobileActivityModel"),
    NotesModel: require("./models/NotesModel"),
    QuizResultModel: require("./models/QuizResultModel"),
    PersonalizedQuizModel: require("./models/PersonalizedQuizModel"),
    SmsLogModel: require("./models/SmsLogModel"),
    ApiCallsModel: require("./models/ApiCallsModel"),
    ConjobLogModel: require("./models/ConjobLogModel"),
    InvoiceModel: require("./models/InvoiceModel"),
    PaymentWebhookModel: require("./models/PaymentWebhookModel"),
    PaymentLogsModel: require("./models/PaymentLogsModel"),
    EmailLogsModel: require("./models/EmailLogsModel"),
    UserActivityModel: require("./models/UserActivityModel"),
    FeedbackModel: require("./models/FeedbackModel"),
    ContactUsModel: require("./models/ContactUsModel"),
    PaymentHistoryModel: require("./models/PaymentHistoryModel"),
    PaymentDetailModel: require("./models/PaymentDetailModel")
}
