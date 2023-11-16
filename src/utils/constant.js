module.exports = {
    SUCCESS_RESPONSE: 200,
    ERROR_RESPONSE: 400,
    DATABASE_ERROR_RESPONSE: 500,
    CONFLICT_RESPONSE: 409,
    OTP_EXPIRE_MINUTE: 1,
    EXCEPTION_ERROR_CODE:410,

    //send mail address configuration
    EMAIL_TEMPLATE_MAIL_ID: "info@virtualafsar.com",
    EMAIL_TEMPLATE_MOBILE_NO: "+91 91042 91082",
    EMAIL_TEMPLATE_ADDRESS: " Ganesh Meridian Complex, 8th, Floor, D, Sarkhej, Gandhinagar Hwy, Ahmedabad, Gujarat380061",

    EMAIL_TEMPLATE_FACEBOOK_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/facebook.png",
    EMAIL_TEMPLATE_INSTAGRAM_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/instagram.png",
    EMAIL_TEMPLATE_LINKEDIN_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/linkedin.png",
    EMAIL_TEMPLATE_TWITTER_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/twitter.png",
    
    EMAIL_TEMPLATE_FACEBOOK_LINK: "https://www.facebook.com/profile.php?id=100095410212980&mibextid=ZbWKwL",
    EMAIL_TEMPLATE_INSTAGRAM_LINK: "https://instagram.com/virtualafsar?igshid=MzRlODBiNWFlZA==",
    EMAIL_TEMPLATE_LINKEDIN_LINK: "https://www.linkedin.com",
    EMAIL_TEMPLATE_TWITTER_LINK: "https://twitter.com/virtualafsar",
    
    EMAIL_TEMPLATE_LOCK_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/lock.png",
    EMAIL_TEMPLATE_LOGO_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/logo.png",
    EMAIL_TEMPLATE_VV_LOGO_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/logo.png",
    EMAIL_TEMPLATE_VV_LOGO_BLACK_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/logo.png",
    EMAIL_TEMPLATE_PAID_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/paid_svg.png",
    EMAIL_TEMPLATE_UNPAID_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/unpaid_svg.png",
    EMAIL_UNSUBSCRIBE_URL: process.env.IMAGE_URL + "/api/client/unsubscribe",
    
    EMAIL_TEMPLATE_APP_STORE_URL: "https://www.apple.com/in/app-store/",
    EMAIL_TEMPLATE_PLAY_STORE_URL: "https://play.google.com/store/apps/details?id=com.tjcg.virtualvidhyapith",
    EMAIL_TEMPLATE_APP_STORE_ICON_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/appstore.png",
    EMAIL_TEMPLATE_PLAY_STORE_ICON_URL: process.env.BASE_URL + "lVV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/playstore.png",
    STUDENT_LOGIN_URL: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/email_assets/twitter.png",

    INVOICE_STATUS_PAID: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/invoice_assets/paid.png",
    INVOICE_STATUS_FAILED: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/invoice_assets/failed.png",
    INVOICE_STATUS_REFUNDED: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/invoice_assets/refunded.png",
    INVOICE_STATUS_UNPAID: process.env.BASE_URL + "VV-LMS-SERVICE-COURSE-QUERY/getcontent/local/invoice_assets/unpaid.png",
};