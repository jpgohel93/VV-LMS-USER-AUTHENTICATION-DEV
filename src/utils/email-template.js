//Utility functions

const constants = require("./constant");
const { awsSignedUrl } = require("./aws");

module.exports.templateHeader = async (data) => {
  return (
    `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>` +
    data.subject +
    `</title>
        <link defer="defer" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;1,100&display=swap"
            rel="stylesheet">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css">
        <style>
            .email-vv {
                max-width: 480px;
                height: auto;
                background-color: #012A82;
                color: #fff;
                margin: auto
            }
        </style>
    </head>
    
    <body>
        <div class="email-vv">
            <div style="padding:10px;@importurl('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');font-family:Montserrat,sans-serif">
                <div style="background:#fff;padding:20px 10px;width:fit-content;height:fit-content;margin:20px;border-radius:10px;width: 9rem; height: 5rem;">
                    <img src="` +
    constants.EMAIL_TEMPLATE_LOGO_URL +
    `" alt="" width="100%" height="auto">
                </div>`
  );
};

module.exports.templateFooter = async (data) => {
  return (
    `
        <hr style="width:90%; margin:auto; border-color: white;">
        <div style="padding:8px 15px 0 15px;">
            <div style="margin-top:0.6rem; background-color: #fff !important;width: 100%;border-radius: 8px; display: flex;">
                <div style="margin-top: 10px; margin-bottom: 10px; padding-right: 10px; border-right: solid 1px #012ab2;padding-left:10px;">
                    <img src="` +
    constants.EMAIL_TEMPLATE_VV_FOOTER_LOGO_URL +
    `" alt="" style="width: 4rem; height: auto;">
                </div>
                <div style="padding-top:10px; padding-bottom:10px;padding-left:20px;">
                <div style="display: flex; align-items: center;">
                <a href="` +
    constants.EMAIL_TEMPLATE_FACEBOOK_LINK +
    `">
                    <img src="` +
    constants.EMAIL_TEMPLATE_FACEBOOK_URL +
    `" style="height: 25px; width: 25px;">
                </a>
                <a href="` +
    constants.EMAIL_TEMPLATE_INSTAGRAM_LINK +
    `">
                    <img style="margin:0 0.2rem; height: 25px; width: 25px;" src="` +
    constants.EMAIL_TEMPLATE_INSTAGRAM_URL +
    `">
                </a>
                <a href="` +
    constants.EMAIL_TEMPLATE_YOUTUBE_LINK +
    `">
                    <img style="margin:0 0.2rem; height: 25px; width: 25px;" src="` +
    constants.EMAIL_TEMPLATE_YOUTUBE_URL +
    `">
                </a>
                <a href="` +
    constants.EMAIL_TEMPLATE_TWITTER_LINK +
    `">
                    <img style="margin:0 0.2rem; height: 25px; width: 25px;" src="` +
    constants.EMAIL_TEMPLATE_TWITTER_URL +
    `">
                </a>
                <a href="` +
    constants.EMAIL_TEMPLATE_LINKEDIN_LINK +
    `">
                    <img style="margin:0 0.2rem; height: 25px; width: 25px;" src="` +
    constants.EMAIL_TEMPLATE_LINKEDIN_URL +
    `">
                </a>
                </div>
                    <div>
                        <a href="mailto:` +
    constants.EMAIL_TEMPLATE_MAIL_ID +
    `" style="margin-bottom: 0;">` +
    constants.EMAIL_TEMPLATE_MAIL_ID +
    `</a>
                        <br/>
                        <a href="tel:` +
    constants.EMAIL_TEMPLATE_MOBILE_NO +
    `">` +
    constants.EMAIL_TEMPLATE_MOBILE_NO +
    `</a>
                    </div>
                </div>
            </div>
            <div style="display: flex;width: 70%;justify-content: flex-start; margin-top: 0.8rem;">
                <button style="background:0 0;border:0;outline:0;width:100%;margin: 0; padding: 0;">
                    <a href="` +
    constants.EMAIL_TEMPLATE_PLAY_STORE_URL +
    `">
                        <img src="` +
    constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL +
    `" alt="" width="100%">
                    </a>
                </button>
                <button style="background:0 0;border:0;outline:0;width:100%; margin-left: 10px; padding: 0; visibility:hidden;">
                    <a href="` +
    constants.EMAIL_TEMPLATE_APP_STORE_URL +
    `">
                        <img src="` +
    constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL +
    `"" alt="" width="100%">
                    </a>
                </button>
            </div>
        </div>
        <div style="padding:0 20px;text-align:center">
            <p style="font-weight:600;font-size:16px"></p>
        </div>
    </div>
    </div>
    </body>

    </html>`
  );
};

module.exports.welcomeTemplate = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem">Dear `) +
    data.user_name +
    `,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Greetings and a warm welcome to the College UPSC Course- Campus se Collector on the Virtual Afsar App!</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">We are thrilled to have you embark on this transformative journey with us. This online course is meticulously crafted to equip you with the essential tools, strategies, and knowledge necessary to excel in your UPSC preparations while navigating the challenges of college life.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Throughout this course, you'll benefit from engaging lectures, comprehensive study materials, interactive quizzes, and personalized guidance from our experienced educators. Our goal is not just to impart information but to foster a deep understanding of the UPSC examination pattern and its nuances, empowering you to approach it with confidence and competence.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">In this dynamic learning environment, we encourage active participation, questions, and discussions to ensure a fulfilling learning experience. Your dedication and commitment combined with our resources will undoubtedly pave the way for success in your UPSC journey.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Feel free to explore the course modules and make the most of the myriad resources available to you on the Virtual Afsar App.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Additionally, stay connected with us on social media to receive updates, tips, and exclusive content:</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Once again, welcome aboard, and let's commence this enriching academic expedition together!</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Best regards,</p>
        <p style="font-weight:400;font-size:15px;color: white;">Virtual Afsar Team</p>
    </div>
    ${footer}
    `
  );
};

module.exports.welcomeWithCredetialsTemplate = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Dear `) +
    data.user_name +
    `,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Welcome aboard to College UPSC - Level 1 at Virtual Afsar! 🚀</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Congratulations on subscribing to our course College UPSC! We are thrilled to have you with us on this enriching educational journey that promises to ignite your learning potential.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Your quest for knowledge begins now, and we're excited to provide you access to our dynamic learning platform tailored specifically for your academic growth.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Below are your login credentials:</p>
    </div>
    <div style="padding: 0 20px">
        <p style="font-weight: 600; font-size: 20px;color: white;">
            <b>Username: </b>` +
    data.mobile_no +
    `<br>
            <b>Password: </b>` +
    data.password +
    `
        </p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">With these credentials, you can now unlock the gateway to a wealth of courses and resources meticulously curated to enhance your learning experience. Our aim is to support you in every step of your educational aspirations and empower you to reach new heights of academic excellence.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Additionally, stay connected with us on our social media channels for updates, tips, and more:</p>
    </div>
   
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: #FE8B00;">For further information and updates, please visit our website: ` +
    constants.EMAIL_BASE_URL +
    `</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Should you need any assistance or have inquiries, don't hesitate to reach out. Our dedicated team is here to ensure your learning journey with us is smooth and fulfilling.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Once again, welcome to College UPSC - Level 1 at Virtual Afsar! Your path to success awaits, and we're privileged to be a part of it.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Best regards,</p>
        <p style="font-weight:400;font-size:15px;color: white;">Virtual Afsar Team</p>
    </div>
    ${footer}
    `
  );
};

module.exports.forgotPasswordTemplate = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-style:normal;font-size:1.8rem;padding:.5rem;color: white;">🔑 Password Reset Requested</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;margin-bottom:0.5rem;color: white;">Hey `) +
    data.user_name +
    `,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;margin-bottom:0.8rem;color: white;">We received a request to reset your password. 🔑 If this was initiated by you, simply click the link below to create a new one:</p>
    </div>
    <div style="padding:0 20px; display: flex; justify-content: center;">
        <a href="` +
    data.link +
    `"
            style="display:block;width:13.125rem;height:3.5rem;text-decoration:none;text-transform:uppercase;display:flex;justify-content:center;align-items:center;background-color:#0076cb;border-radius:2rem;margin-bottom:0.8rem;margin-bottom: 2rem;margin-top: 1.5rem">
            <div style="font-style:normal;font-weight:600;font-size:16px;color:#fff;margin:auto;text-align:center;position:absolute;line-height:24px">Reset Password</div>
        </a>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">If this request didn't come from you, please notify us immediately!</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Stay safe,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Virtual Afsar Team</p>
    </div>
    ${footer}`
  );
};

// ---- COURSE ASSIGNED TEMPLATE (START) ----
module.exports.courseAssignedTemplate = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  const courseUrl = data?.course_id
    ? constants.EMAIL_COURSE_URL + data.course_id
    : process.env.BASE_URL;
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;"> Dear `) +
    data.user_name +
    `</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">We're thrilled to embark on this educational journey with you as you begin the College UPSC - Level 1 course with Virtual Afsar!
        </p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Here's a breakdown of what's in store for you:</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;"><b>Course Purchase Confirmation:</b> Your enrollment in the College UPSC - Level 1 course is confirmed! This course is designed to equip you comprehensively for your UPSC exams.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;"><b>Account Creation:</b> Your account under the ` +
    data.user_name +
    ` has been successfully created. To dive into the course materials, simply login to the Virtual Afsar Platform using the button below.</p>
    </div>
    <div style="padding:0 20px; display: flex; justify-content: center;">
        <a href="` +
    courseUrl +
    `"
            style="display:block;width:13.125rem;height:3.5rem;text-decoration:none;text-transform:uppercase;display:flex;justify-content:center;align-items:center;background-color:#0076cb;border-radius:2rem">
            <div style="font-style:normal;font-weight:600;font-size:16px;color:#fff;margin:auto;text-align:center;position:absolute;line-height:24px">Go To Course</div>
        </a>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;"><b>Have Questions?</b> Whether it's about the course content, platform navigation, or any other queries, our support staff is just a message away. Feel free to reach out to us; we're committed to ensuring your learning experience is smooth and productive.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Additionally, stay connected with us on our social media channels for updates, tips, and more:</p>
    </div>
   
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: #FE8B00;">For further information and updates, please visit our website: ` +
    constants.EMAIL_BASE_URL +
    `</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">We're dedicated to supporting you at every step of your learning journey. Let's work together towards your success!</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Best regards,</p>
        <p style="font-weight:400;font-size:15px;color: white;">Virtual Afsar Team</p>
    </div>

    ${footer}
    `
  );
};

// ---- COURSE ASSIGNED TEMPLATE (END) ----

// ---- COURSE PURCHASED TEMPLATE (START) ----
module.exports.coursePurchaseTemplate = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  const courseUrl = data?.course_id
    ? constants.EMAIL_COURSE_URL + data.course_id
    : process.env.BASE_URL;
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;"> Dear,
        `) +
    data.user_name +
    `</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Congratulations on your recent purchase of the College UPSC - Level 1 course on Virtual Afsar! We're thrilled to embark on this educational journey with you.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Your account under the username "${data.user_name}" has been successfully created, granting you access to a world of learning opportunities to excel in your UPSC preparations.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">To commence your learning experience, kindly log in to the Virtual Afsar Platform using the button below:</p>
    </div>
    <div style="padding:0 20px; display: flex; justify-content: center;">
        <a href="` +
    courseUrl +
    `"
            style="display:block;width:13.125rem;height:3.5rem;text-decoration:none;text-transform:uppercase;display:flex;justify-content:center;align-items:center;background-color:#0076cb;border-radius:2rem">
            <div style="font-style:normal;font-weight:600;font-size:16px;color:#fff;margin:auto;text-align:center;position:absolute;line-height:24px"> Go To Course</div>
        </a>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">We've meticulously designed a comprehensive product tour explicitly tailored to introduce you to our platform's features. This tour aims to ensure you leverage our resources to their fullest potential.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Should you have any questions or need assistance while getting started, our dedicated support team is available to assist you. Feel free to reach out by replying to this email or contacting our support staff directly.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Stay connected with us! Follow our social media channels for additional study tips, updates, and engaging content:</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Additionally, stay connected with us on our social media channels for updates, tips, and more:</p>
    </div>
    
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: #FE8B00;">For further information and updates, please visit our website: ` +
    constants.EMAIL_BASE_URL +
    `</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Thank you for choosing Virtual Afsar as your partner in achieving your UPSC goals. We're committed to providing you with the guidance and resources needed for success.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Welcome aboard, and let's begin this enriching learning journey together!</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Best regards,</p>
        <p style="font-weight:400;font-size:15px;color: white;">Virtual Afsar Team</p>
    </div>

    ${footer}
    `
  );
};
// ---- COURSE PURCHASED TEMPLATE (END) ----

module.exports.courseSubscription = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">🎁 You're In! Subscription Confirmation for `) +
    data.course_name +
    `</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Hey ` +
    data.user_name +
    `,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Hooray! You've successfully subscribed to the ` +
    data.course_name +
    ` package. 🎁 Now, you've got the key to unlimited access to our ` +
    data.course_name +
    `.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Kickstart your learning adventure now:</p>
    </div>
    <div style="padding:0 20px; display: flex; justify-content: center;">
        <a href="` +
    data.link +
    `"
            style="display:block;width:13.125rem;height:3.5rem;text-decoration:none;text-transform:uppercase;display:flex;justify-content:center;align-items:center;background-color:#0076cb;border-radius:2rem">
            <div style="font-style:normal;font-weight:600;font-size:16px;color:#fff;margin:auto;text-align:center;position:absolute;line-height:24px">Login</div>
        </a>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Happy learning,</p>
    </div>
    ${footer}`
  );
};

module.exports.renewedCourseSubscription = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">🎉 Hooray! Your Subscription Has Been Renewed</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Hey `) +
    data.user_name +
    `,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">We're doing a happy dance because your subscription has been renewed! 🎉 Continue to enjoy the endless learning possibilities with us.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Log in now and keep the knowledge flowing:</p>
    </div>
    <div style="padding:0 20px; display: flex; justify-content: center;">
        <a href="` +
    data.link +
    `"
            style="display:block;width:13.125rem;height:3.5rem;text-decoration:none;text-transform:uppercase;display:flex;justify-content:center;align-items:center;background-color:#6c63ff;border-radius:2rem">
            <div style="font-style:normal;font-weight:600;font-size:16px;color:#fff;margin:auto;text-align:center;position:absolute;line-height:24px">Login</div>
        </a>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Happy learning,</p>
    </div>
    ${footer}`
  );
};

module.exports.subscriptionCancelTemplate = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Course Subscription Cancellation</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Hey `) +
    data.user_name +
    `,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">We hope this email finds you well. We would like to confirm that your course subscription cancellation request has been successfully processed. Your subscription will be terminated effective immediately, and no further charges will be applied to your account starting from the next billing cycle.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Here are the course of your canceled subscription: ` +
    data.course_title +
    `</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">We understand that circumstances change, and we appreciate the time you spent as a subscriber to our courses. We hope that you found value in the content and resources we provided during your subscription period.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Thank you for being a part of our learning community.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px">Warm regards,</p>
    </div>
    ${footer}`
  );
};

module.exports.courseExpireTemplate = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-style: normal; font-size: 2.2rem;line-height: 2.4rem; padding: 0.5rem; font-weight: 600; ">⏳ Tick Tock: `) +
    data.course_name +
    ` Expiring Soon</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem">Dear ` +
    data.user_name +
    `,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem">Just a quick heads-up: your access to the ` +
    data.course_name +
    ` course will end on ` +
    data.expireDate +
    `. ⏳ Make sure to finish any remaining content before then. If you'd like more time, you can extend access in your account settings.</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem">Log in to your account now:</p>
    </div>
    <div style="padding:0 20px; display: flex; justify-content: center;">
        <a href="` +
    process.env.LOGIN_LINK_LIVE +
    `" style="display:block;width:13.125rem;height:3.5rem;text-decoration:none;text-transform:uppercase;display:flex;justify-content:center;align-items:center;background-color:#6c63ff;border-radius:2rem">
            <div style="font-style:normal;font-weight:600;font-size:16px;color:#fff;margin:auto;text-align:center;position:absolute;line-height:24px">Login</div>
        </a>
    </div>
    ${footer}`
  );
};

module.exports.contactUsInquirySubmission = async (data) => {
  const header = await this.templateHeader(data);
  const footer = await this.templateFooter(data);
  return (
    (await `${header}
    <div style="padding:0 20px">
        <p style="font-style: normal; font-size: 2.2rem;line-height: 2.4rem; padding: 0.5rem; font-weight: 600; color: white;">📞 New Contact Us Inquiry Has Been Received</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Dear Admin,</p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">We're excited to notify you that a new inquiry has just been submitted through the contact form on your app. Please take a moment to review the details provided below:</p>
    </div>
    <div style="padding: 0 20px">
    <p style="font-weight: 600; font-size: 20px;color: white;">
    <b>Name: </b>`) +
    data.user_name +
    `<br>
    <b>Email: </b>` +
    data.id +
    `<br>
    <b>Subject: </b>` +
    data.subject +
    `<br>
    <b>Message: </b>` +
    data.your_message +
    `<br>
    </p>
    </div>
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:1.2rem;color: white;">Feel free to address this inquiry promptly and provide the necessary assistance or information required.</p>
    </div>
    
    <div style="padding:0 20px">
        <p style="font-weight:400;font-size:15px;color: white;">Best regards,</p>
        <p style="font-weight:400;font-size:15px;color: white;">Virtual Afsar Team</p>
    </div>

    ${footer}
    `
  );
};

module.exports.sendLoginCredencialTemplate = async (data) => {};

module.exports.courseAssignTemplate = async (data) => {};

module.exports.dailySnapshot = async (data) => {
  let stateDistribution = "";
  let cityDistribution = "";

  const cityDistributionArray = [];
  if (data?.cityDistribution) {
    for (const city in data.cityDistribution) {
      if (Object.hasOwnProperty.call(data.cityDistribution, city)) {
        const cityData = data.cityDistribution[city];
        const cityObject = {
          city,
          ...cityData,
        };
        cityDistributionArray.push(cityObject);
      }
    }
  }

  const stateDistributionArray = [];
  if (data?.stateDistribution) {
    for (const state in data.stateDistribution) {
      if (Object.hasOwnProperty.call(data.stateDistribution, state)) {
        const stateData = data.stateDistribution[state];
        const stateObject = {
          state,
          ...stateData,
        };
        stateDistributionArray.push(stateObject);
      }
    }
  }

  if (stateDistributionArray?.length > 0) {
    stateDistributionArray.forEach((element, key) => {
      stateDistribution += ` <tr style="border: 1px solid #e8e8eb;">`;

      stateDistribution += `<td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
            font-family: Montserrat, sans-serif;">${element.state}</td>`;

      stateDistribution += `<td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
            font-family: Montserrat, sans-serif;">${
              element?.stateTodayDistribution || 0
            }</td>`;

      stateDistribution += `<td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
            font-family: Montserrat, sans-serif;">${
              element?.stateLastSevrnDayDistribution || 0
            }</td>`;

      stateDistribution += `<td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
            font-family: Montserrat, sans-serif;">${
              element?.stateOverallDistribution || 0
            }</td>`;

      stateDistribution += ` </tr>`;
    });
  }

  if (cityDistributionArray?.length > 0) {
    cityDistributionArray.forEach((element) => {
      cityDistribution += ` <tr style="border: 1px solid #e8e8eb;">`;

      cityDistribution += `<td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
            font-family: Montserrat, sans-serif;">${element.city}</td>`;

      cityDistribution += `<td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
            font-family: Montserrat, sans-serif;">${
              element?.cityTodayDistribution || 0
            }</td>`;

      cityDistribution += `<td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
            font-family: Montserrat, sans-serif;">${
              element?.cityLastSevrnDayDistribution || 0
            }</td>`;

      cityDistribution += `<td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
            font-family: Montserrat, sans-serif;">${
              element?.cityOverallDistribution || 0
            }</td>`;

      cityDistribution += ` </tr>`;
    });
  }

  return await `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
    </head>
    
    <body>
        <div style="max-width: 480px; margin: auto;">
            <div
                style="display: flex; align-items: center; justify-content: space-between; height: fit-content; padding: 10px 10px 0 10px;">
                <div>
                    <img src="${
                      constants.EMAIL_TEMPLATE_LOGO_URL
                    }" alt="Virtualafsar" style="max-height: 80px;" />
                </div>
                <div style=" background: #fff;
                text-align: right;
                padding: 8px 13px;
                margin-left: auto;
                border-radius: 5px;">
                    <!-- Add your date and time here -->
                    <p style="margin: 0; color: rgba(76, 78, 100, 0.87);  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${data.date}</p>
                </div>
            </div>
    
            <div>
                <p style="font-weight: 600;
                font-size: 1.1rem;
                color: rgba(76, 78, 100, 0.87);
                text-align: left;
                line-height: 1;
                margin-top: 10px;
                margin-bottom: 12px;
                @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                font-family: Montserrat, sans-serif;">Admin Insights: A Daily Snapshot</p>
            </div>
    
            
            <table style="color: rgba(76, 78, 100, 0.87); width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="border: 1px solid #e8e8eb;">
                    <th style="padding: 8px; border: 1px solid #e8e8eb; font-size: 1rem;color: black; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Metrics</strong></th>
                    <th style="padding: 8px; border: 1px solid #e8e8eb; font-size: 1rem;color: black; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Today</strong></th>
                    <th style="padding: 8px; border: 1px solid #e8e8eb; font-size: 1rem;color: black; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Last 7 Days</strong></th>
                    <th style="padding: 8px; border: 1px solid #e8e8eb; font-size: 1rem;color: black; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Overall</strong></th>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; color:black; font-weight: 700; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>User Growth</strong></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">New Users</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.todaySignup}</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.lastSevrnDaySignup}</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.overallSignup}</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Active Users</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.todayActiveUsersData}</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data.lastSevrnDayActiveUsersData
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data.overallActiveUsersData
        }</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Referral Traffic</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.todayReferral}</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.lastSevrnDayReferral}</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.overallReferral}</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; color:black; font-weight: 700; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Engagement</strong></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Session Duration</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data.todaySessionDurationsData
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data.lastSevrnDaySessionDurationsData
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data.overallSessionDurationsData
        }</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">Video Views</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.todayWatchVideo
                    }</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.lastSevrnDayWatchVideo
                    }</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.overallWatchingVideo
                    }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">Video Completion</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.todayCompletedVideo
                    }%</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.lastSevrnDayCompletedVideo
                    }%</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.overallCompletedingVideo
                    }%</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; color:black; font-weight: 700; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Monetization</strong></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Revenue</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayRevenueData?.amount || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayRevenueData?.amount || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.overallRevenueData?.amount || 0
        }</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Paid Subscriptions</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayRevenueData?.user_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayRevenueData?.user_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.overallRevenueData?.user_count || 0
        }</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; color:black; font-weight: 700; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                        font-family: Montserrat, sans-serif;"><strong>State Demographics</strong></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                ${stateDistribution}

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; color:black; font-weight: 700; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                        font-family: Montserrat, sans-serif;"><strong>City Demographics</strong></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                ${cityDistribution}
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                        font-family: Montserrat, sans-serif;"><strong>Age Ranges</strong></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb;"></td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">below 16</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.first_range_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayAgeRagngeData?.first_range_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.overallAgeRagngeData?.first_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">17 - 28</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.second_range_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayAgeRagngeData?.second_range_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.overallAgeRagngeData?.second_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">28 - 45</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.third_range_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayAgeRagngeData?.third_range_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.overallAgeRagngeData?.third_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">45+</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.forth_range_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayAgeRagngeData?.forth_range_count || 0
        }</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.overallAgeRagngeData?.forth_range_count || 0
        }</td>
                </tr>
            </table>
    </body>
    
    </html>`;

  // <tr style="border: 1px solid #e8e8eb;">
  //                 <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
  //     font-family: Montserrat, sans-serif;">Conversion Rate</td>
  //                 <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
  //     font-family: Montserrat, sans-serif;">${0}</td>
  //                 <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
  //     font-family: Montserrat, sans-serif;">${0}</td>
  //                 <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
  //     font-family: Montserrat, sans-serif;">${0}</td>
  //             </tr>
};