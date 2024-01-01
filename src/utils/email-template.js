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
  // const header = await this.templateHeader(data);
  // const footer = await this.templateFooter(data);
  // return (
  //   (await `${header}
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem">Dear `) +
  //   data.user_name +
  //   `,</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Greetings and a warm welcome to the College UPSC Course- Campus se Collector on the Virtual Afsar App!</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">We are thrilled to have you embark on this transformative journey with us. This online course is meticulously crafted to equip you with the essential tools, strategies, and knowledge necessary to excel in your UPSC preparations while navigating the challenges of college life.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Throughout this course, you'll benefit from engaging lectures, comprehensive study materials, interactive quizzes, and personalized guidance from our experienced educators. Our goal is not just to impart information but to foster a deep understanding of the UPSC examination pattern and its nuances, empowering you to approach it with confidence and competence.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">In this dynamic learning environment, we encourage active participation, questions, and discussions to ensure a fulfilling learning experience. Your dedication and commitment combined with our resources will undoubtedly pave the way for success in your UPSC journey.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Feel free to explore the course modules and make the most of the myriad resources available to you on the Virtual Afsar App.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Additionally, stay connected with us on social media to receive updates, tips, and exclusive content:</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Once again, welcome aboard, and let's commence this enriching academic expedition together!</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:15px;color: white;">Best regards,</p>
  //       <p style="font-weight:400;font-size:15px;color: white;">Virtual Afsar Team</p>
  //   </div>
  //   ${footer}
  //   `
  // );

  // return await `
  // <!doctype html>
  //     <html lang="en">

  //     <head>
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //         <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  //         <title>Simple Transactional Email</title>
  //     </head>

  //     <body
  //         style="-webkit-font-smoothing: antialiased; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; margin: 0; padding: 0;">
  //         <table role="presentation" border="0" cellpadding="0" cellspacing="0"
  //             style="border-collapse: separate; background-color: #FFF; width: 100%;">
  //             <tr>
  //                 <!-- Extra TD -->
  //                 <td style="font-size: 16px; vertical-align: top;" valign="top">&nbsp;
  //                 </td>

  //                 <!-- Main TD -->
  //                 <td style="font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; width: 600px; margin: 0 auto;"
  //                     width="600" valign="top">
  //                     <div style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">

  //                         <!-- START CENTERED WHITE CONTAINER -->
  //                         <span
  //                             style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0;">This
  //                             is preheader text. Some clients will show this text as a preview.</span>
  //                         <table role="presentation" border="0" cellpadding="0" cellspacing="0"
  //                             style="border-collapse: separate; background: #ffffff; width: 100%;" width="100%">

  //                             <!-- START MAIN CONTENT AREA -->
  //                             <tr>
  //                                 <td style="font-size: 16px; vertical-align: top; box-sizing: border-box;" valign="top">
  //                                     <table role="presentation" border="0" cellpadding="0" cellspacing="0"
  //                                         style="border-collapse: separate; box-sizing: border-box; width: 100%; min-width: 100%;"
  //                                         width="100%">
  //                                         <tbody>
  //                                             <tr>
  //                                                 <td align="center" style="padding: 20px; padding-bottom: 30px;"
  //                                                     valign="center">
  //                                                   <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="text-decoration: none;">
  //                                                     <img src="${ constants.EMAIL_TEMPLATE_LOGOGIF_URL }" />
  //                                                 </a>
  //                                                 </td>
  //                                             </tr>
  //                                             <tr>
  //                                                 <td valign="center">
  //                                                     <img src="${ constants.EMAIL_TEMPLATE_HERO3_URL }" height="500" width="100%" />
  //                                                 </td>
  //                                             </tr>
  //                                             <tr>
  //                                                 <td style="text-align: center;">
  //                                                     <div
  //                                                         style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
  //                                                         <div style="display: flex;flex-direction: row;">
  //                                                             <p
  //                                                                 style="font-family: sans-serif; font-size: 30px; margin: 0 8px 8px 0; font-weight: bold; color: rgb(255, 164, 79);">
  //                                                                 Welcome to</p>
  //                                                             <span
  //                                                                 style="font-family: sans-serif;font-size: 30px; margin: 0 0 8px 0;color: rgb(42, 42, 150);">Virtual
  //                                                                 Afsar...</span>
  //                                                         </div>
  //                                                         <p
  //                                                             style="font-size: 20px; text-align: center;font-family: sans-serif; font-weight: normal; color: rgb(50, 75, 118);">
  //                                                             ऐसे ही सरकारी अधिकारी की Car की Booking नही होती, यह मिलती है
  //                                                             UPSC जैसी Exam Clear करने पर। सपनों की उड़ान, जैसे पंख फैलाने का
  //                                                             आया हैं सुनहरा अवसर, आपके सपनों को साकार करने हम लाये है Virtual
  //                                                             Afsar.</p>
  //                                                     </div>
  //                     </div>
  //                 </td>
  //             </tr>

  //             <tr>
  //                 <td valign="center">
  //                     <img src="${ constants.EMAIL_TEMPLATE_BOYMOBILE_URL }" height="690" width="100%" style="margin-bottom: -4px;" />
  //                 </td>
  //             </tr>
  //             <!-- START FOOTER -->
  //             <tr style="background-color:#032b4e;">
  //                 <td style="padding: 20px 35px;">
  //                     <table role="presentation" border="0" cellpadding="0" cellspacing="0"
  //                         style="box-sizing: border-box; width: 100%; min-width: 100%;" width="100%">
  //                         <tbody>
  //                             <tr>
  //                                 <tr>
  //                                     <td style="vertical-align:baseline">
  //                                         <p>
  //                                             <a href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }"
  //                                                 style="cursor:pointer;text-decoration: none;" target="_blank">
  //                                                 <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }"
  //                                                     height="55px" />
  //                                             </a>
  //                                         </p>
  //                                         <p>
  //                                             <a href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }"
  //                                                 style="cursor:pointer; text-decoration: none;" target="_blank">
  //                                                 <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" height="55px"
  //                                                     style="cursor:pointer;" />
  //                                             </a>
  //                                         </p>
  //                                     </td>
  //                                     <td style="text-align: right;">
  //                                         <a href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank"
  //                                             style="margin-bottom: -8px; margin-top: 0 ; text-decoration: none;">
  //                                             <span style="vertical-align: super;
  //                                                 font-family: Arial, Helvetica, sans-serif;
  //                                                 font-size: 17px;
  //                                                 font-weight: 600;
  //                                                 color: #FFF;
  //                                                 cursor:pointer;
  //                                                 ">${ constants.EMAIL_TEMPLATE_MAIL_ID }</span>
  //                                             <img src="${ constants.EMAIL_TEMPLATE_MAIL_URL }" height="25px"
  //                                                 style="cursor:pointer;" />
  //                                         </a>
  //                                         <p>
  //                                             <a href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }"
  //                                                 style="text-decoration: none;">
  //                                                 <span style="vertical-align: super;
  //                                             font-family: Arial, Helvetica, sans-serif;
  //                                             font-size: 17px;
  //                                             font-weight: 600;
  //                                             color: #FFF;
  //                                             cursor: pointer;">${ constants.EMAIL_TEMPLATE_MOBILE_NO }</span>
  //                                                 <img src="${ constants.EMAIL_TEMPLATE_PHONE_URL }" height="25px"
  //                                                     style="cursor:pointer;" />
  //                                             </a>
  //                                         </p>
  //                                         <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="text-decoration: none;">
  //                                             <img src="${ constants.EMAIL_TEMPLATE_WEB_URL }" height="25px"
  //                                                 style="margin: 0 5px; cursor: pointer" /></a>
  //                                         <a
  //                                             href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="text-decoration: none;">
  //                                             <img src=" ${ constants.EMAIL_TEMPLATE_FB_URL }" height="25px"
  //                                                 style="margin: 0 5px; cursor: pointer" />
  //                                         </a>
  //                                         <a
  //                                             href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="text-decoration: none;">
  //                                             <img src="${ constants.EMAIL_TEMPLATE_TWITTER_URL }" height="25px"
  //                                                 style="margin: 0 5px; cursor: pointer" />
  //                                         </a>
  //                                         <a
  //                                             href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="text-decoration: none;">
  //                                             <img src="${ constants.EMAIL_TEMPLATE_INSTA_URL }" height="25px"
  //                                                 style="margin: 0 5px; cursor: pointer" />
  //                                         </a>
  //                                         <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="text-decoration: none;">
  //                                             <img src="${ constants.EMAIL_TEMPLATE_YT_URL }" height="25px"
  //                                                 style="margin: 0 5px; cursor: pointer" />
  //                                         </a>
  //                                         <a
  //                                             href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank" style="text-decoration: none;">
  //                                             <img src="${ constants.EMAIL_TEMPLATE_IN_URL }" height="25px"
  //                                                 style="cursor: pointer" />
  //                                         </a>
  //                                     </td>
  //                                 </tr>
  //                             </tr>
  //                         </tbody>
  //                     </table>
  //                 </td>
  //             </tr>
  //             <!-- END FOOTER -->
  //             </td>
  //             </tr>
  //             </tbody>
  //         </table>
  //         </td>
  //         </tr>

  //         <!-- END MAIN CONTENT AREA -->
  //         </table>
  //         <!-- END CENTERED WHITE CONTAINER -->
  //         </div>
  //         </td>

  //         <!-- Extra TD -->
  //         <td style="font-size: 16px; vertical-align: top;" valign="top">&nbsp;
  //         </td>
  //         </tr>
  //         </table>
  //     </body>

  //     </html>
  // `;

  return await `
  <!DOCTYPE html>
<html lang="en">

<body style="margin: 0; padding: 0">
  <div style="max-width: 30rem; margin: auto">
    <div style="height: 100px; text-align: center; padding: 15px 0">
      <a style="text-decoration: none; cursor: pointer" href=" ${ constants.EMAIL_BASE_URL }" target="_blank">
        <img src="${ constants.EMAIL_TEMPLATE_LOGOGIF_URL }" style="height: 100%" />
      </a>
    </div>
    <div>
      <img src="${ constants.EMAIL_TEMPLATE_HERO3_URL }" style="height: 100%; width: 100%" />
    </div>
    <div style="text-align: center; margin-top: 30px;">
      <p style="
            font-family: sans-serif;
            font-size: 30px;
            margin: 10px;
            margin-bottom: 30px;
            font-weight: bold;
            color: #f5a848;
          ">
        Welcome to
        <span style="color: #032b4e"> Virtual Afsar... </span>
      </p>
      <p style="
            font-size: 20px;
            text-align: center;
            font-family: sans-serif;
            font-weight: normal;
            color: #032b4e;
          ">
        ऐसे ही <span style="font-weight: bold;">सरकारी अधिकारी की Car</span> की Booking नही होती, यह मिलती है <span
          style="font-weight: bold;">UPSC
          जैसी Exam</span> Clear करने पर। सपनों की उड़ान, जैसे पंख फैलाने का आया हैं
        <span style="font-weight: bold;">सुनहरा अवसर</span>, आपके <span style="font-weight: bold;">सपनों को साकार</span>
        करने हम लाये है <span style="font-weight: bold;">Virtual Afsar.</span>
      </p>
    </div>
    <div style="margin-bottom: -4px">
      <img src="${ constants.EMAIL_TEMPLATE_BOYMOBILE_URL }" style="width: 100%; height: 100%; margin-bottom: -4px" />
    </div>
    <table style="width: 100%; background: #032b4e; padding: 10px 20px">
      <tbody style="width: 100%">
        <tr>
          <td style="vertical-align: middle; width: 50%">
            <div style="width: 8rem">
              <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }">
                <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }" style="width: 100%; height: 100%" />
              </a>
            </div>
            <div style="width: 8rem; margin-top: 1rem">
              <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }">
                <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" style="width: 100%; height: 100%" />
              </a>
            </div>
          </td>
          <td style="vertical-align: top; text-align: right; width: 50%">
            <div style="padding-bottom: 10px">
              <a style="text-decoration: none; color: #fff; cursor: pointer"
                href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank">${ constants.EMAIL_TEMPLATE_MAIL_ID
                }
                <span style="vertical-align: middle">
                  <img src="${ constants.EMAIL_TEMPLATE_MAIL_URL }"
                    style="width: 25px; height: 25px; padding-left: 7px" />
                </span>
              </a>
            </div>
            <div>
              <a style="text-decoration: none; color: #fff; cursor: pointer"
                href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }">${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                <span style="vertical-align: middle">
                  <img src="${ constants.EMAIL_TEMPLATE_PHONE_URL }"
                    style="width: 25px; height: 25px; padding-left: 7px" />
                </span>
              </a>
            </div>
            <div>
              <p>
                <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_WEB_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src=" ${ constants.EMAIL_TEMPLATE_FB_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_TWITTER_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_INSTA_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YT_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank"
                  style="text-decoration: none; cursor: pointer">
                  <img src="${ constants.EMAIL_TEMPLATE_IN_URL }" style="width: 25px; height: 25px" />
                </a>
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>

</html>`
};

module.exports.welcomeWithCredetialsTemplate = async (data) => {
  // const header = await this.templateHeader(data);
  // const footer = await this.templateFooter(data);
  // return (
  //   (await `${header}
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Dear `) +
  //   data.user_name +
  //   `,</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Welcome aboard to College UPSC - Level 1 at Virtual Afsar! 🚀</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Congratulations on subscribing to our course College UPSC! We are thrilled to have you with us on this enriching educational journey that promises to ignite your learning potential.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Your quest for knowledge begins now, and we're excited to provide you access to our dynamic learning platform tailored specifically for your academic growth.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Below are your login credentials:</p>
  //   </div>
  //   <div style="padding: 0 20px">
  //       <p style="font-weight: 600; font-size: 20px;color: white;">
  //           <b>Username: </b>` +
  //   data.mobile_no +
  //   `<br>
  //           <b>Password: </b>` +
  //   data.password +
  //   `
  //       </p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">With these credentials, you can now unlock the gateway to a wealth of courses and resources meticulously curated to enhance your learning experience. Our aim is to support you in every step of your educational aspirations and empower you to reach new heights of academic excellence.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Additionally, stay connected with us on our social media channels for updates, tips, and more:</p>
  //   </div>
   
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">For further information and updates, please visit our website:
  //         <a href="` + constants.EMAIL_BASE_URL + `" style="color: #fe8b00 !important;"> ` + constants.EMAIL_BASE_URL + `</a>
  //       </p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Should you need any assistance or have inquiries, don't hesitate to reach out. Our dedicated team is here to ensure your learning journey with us is smooth and fulfilling.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:1.2rem;color: white;">Once again, welcome to College UPSC - Level 1 at Virtual Afsar! Your path to success awaits, and we're privileged to be a part of it.</p>
  //   </div>
  //   <div style="padding:0 20px">
  //       <p style="font-weight:400;font-size:15px;color: white;">Best regards,</p>
  //       <p style="font-weight:400;font-size:15px;color: white;">Virtual Afsar Team</p>
  //   </div>
  //   ${footer}
  //   `
  // );

    // return await `
    // <!doctype html>
    //   <html lang="en">

    //   <head>
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    //       <title>Simple Transactional Email</title>
    //   </head>

    //   <body
    //       style="-webkit-font-smoothing: antialiased; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; margin: 0; padding: 0;">
    //       <table role="presentation" border="0" cellpadding="0" cellspacing="0"
    //           style="border-collapse: separate; background-color: #FFF; width: 100%;"
    //           width="100%" bgcolor="#f4f5f6">
    //           <tr>
    //               <!-- Extra TD -->
    //               <td style="font-size: 16px; vertical-align: top;" valign="top">&nbsp;
    //               </td>

    //               <!-- Main TD -->
    //               <td style="font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; width: 600px; margin: 0 auto;"
    //                   width="600" valign="top">
    //                   <div style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">

    //                       <!-- START CENTERED WHITE CONTAINER -->
    //                       <span
    //                           style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; visibility: hidden; width: 0;">This
    //                           is preheader text. Some clients will show this text as a preview.</span>
    //                       <table role="presentation" border="0" cellpadding="0" cellspacing="0"
    //                           style="border-collapse: separate; background: #ffffff; width: 100%;"
    //                           width="100%">

    //                           <!-- START MAIN CONTENT AREA -->
    //                           <tr>
    //                               <td style="font-size: 16px; vertical-align: top; box-sizing: border-box;" valign="top">
    //                                   <table role="presentation" border="0" cellpadding="0" cellspacing="0"
    //                                       style="border-collapse: separate; box-sizing: border-box; width: 100%; min-width: 100%;"
    //                                       width="100%">
    //                                       <tbody>
    //                                           <tr>
    //                                               <td style="padding: 20px; padding-bottom: 30px; text-align: center;">
    //                                                   <a href=" ${ constants.EMAIL_BASE_URL }" target="_blank" style="text-decoration: none;">
    //                                                       <img src="${ constants.EMAIL_TEMPLATE_VALOGO_URL }" height="95" />
    //                                                   </a>
    //                                               </td>
    //                                           </tr>
    //                                           <tr>
    //                                               <td style="text-align: center;">
    //                                                   <img src="${ constants.EMAIL_TEMPLATE_HERO4_URL }" height="430" width="100%" />
    //                                               </td>
    //                                           </tr>
    //                                           <tr>
    //                                               <td style="padding: 40px 0; text-align: center;">
    //                                                   <button style="
    //                                                       background-color: #032b4e;
    //                                                       color: #fff;
    //                                                       font-size: 22px;
    //                                                       cursor: pointer;
    //                                                       font-weight: bold;
    //                                                       padding: 2px;
    //                                                       border: solid 3px  #032b4e;
    //                                                       border-radius: 0.9rem;
    //                                                       background-clip: content-box; 
    //                                                       font-family: sans-serif;
    //                                                       height: 50px;
    //                                                       width: 200px;">
    //                                                       Reset Password
    //                                                   </button>
    //                                               </td>
    //                                           </tr>
    //                                           <!-- START FOOTER -->
    //                                           <tr style="background-color:#fbaa2d;">
    //                                               <td style="padding: 20px 35px;">
    //                                                   <table role="presentation" border="0" cellpadding="0" cellspacing="0"
    //                                                       style="box-sizing: border-box; width: 100%; min-width: 100%;"
    //                                                       width="100%">
    //                                                       <tbody>
    //                                                           <tr>
    //                                                               <td style="vertical-align:baseline">
    //                                                                   <p>
    //                                                                       <a href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }"
    //                                                                           style="cursor:pointer;text-decoration: none;" target="_blank">
    //                                                                           <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }"
    //                                                                               height="55px" />
    //                                                                       </a>
    //                                                                   </p>
    //                                                                   <p>
    //                                                                       <a href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }"
    //                                                                           style="cursor:pointer; text-decoration: none;" target="_blank">
    //                                                                           <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" height="55px"
    //                                                                               style="cursor:pointer;" />
    //                                                                       </a>
    //                                                                   </p>
    //                                                               </td>
    //                                                               <td style="text-align: right;">
    //                                                                   <a href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank"
    //                                                                       style="margin-bottom: -8px; margin-top: 0 ; text-decoration: none;">
    //                                                                       <span style="vertical-align: super;
    //                                                                           font-family: Arial, Helvetica, sans-serif;
    //                                                                           font-size: 17px;
    //                                                                           font-weight: 600;
    //                                                                           color: #FFF;
    //                                                                           cursor:pointer;
    //                                                                           ">${ constants.EMAIL_TEMPLATE_MAIL_ID }</span>
    //                                                                       <img src="${ constants.EMAIL_TEMPLATE_YMAIL_URL }" height="25px"
    //                                                                           style="cursor:pointer;" />
    //                                                                   </a>
    //                                                                   <p>
    //                                                                       <a href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }"
    //                                                                           style="text-decoration: none;">
    //                                                                           <span style="vertical-align: super;
    //                                                                       font-family: Arial, Helvetica, sans-serif;
    //                                                                       font-size: 17px;
    //                                                                       font-weight: 600;
    //                                                                       color: #FFF;
    //                                                                       cursor: pointer;">${ constants.EMAIL_TEMPLATE_MOBILE_NO }</span>
    //                                                                           <img src="${ constants.EMAIL_TEMPLATE_YPHONE_URL }" height="25px"
    //                                                                               style="cursor:pointer;" />
    //                                                                       </a>
    //                                                                   </p>
    //                                                                   <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="text-decoration: none;">
    //                                                                       <img src="${ constants.EMAIL_TEMPLATE_YWEB_URL }" height="25px"
    //                                                                           style="margin: 0 5px; cursor: pointer" /></a>
    //                                                                   <a
    //                                                                       href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="text-decoration: none;">
    //                                                                       <img src=" ${ constants.EMAIL_TEMPLATE_YFB_URL }" height="25px"
    //                                                                           style="margin: 0 5px; cursor: pointer" />
    //                                                                   </a>
    //                                                                   <a
    //                                                                       href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="text-decoration: none;">
    //                                                                       <img src="${ constants.EMAIL_TEMPLATE_YTWITTER_URL }" height="25px"
    //                                                                           style="margin: 0 5px; cursor: pointer" />
    //                                                                   </a>
    //                                                                   <a
    //                                                                       href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="text-decoration: none;">
    //                                                                       <img src="${ constants.EMAIL_TEMPLATE_YINSTA_URL }" height="25px"
    //                                                                           style="margin: 0 5px; cursor: pointer" />
    //                                                                   </a>
    //                                                                   <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="text-decoration: none;">
    //                                                                       <img src="${ constants.EMAIL_TEMPLATE_YYT_URL }" height="25px"
    //                                                                           style="margin: 0 5px; cursor: pointer" />
    //                                                                   </a>
    //                                                                   <a
    //                                                                       href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank" style="text-decoration: none;">
    //                                                                       <img src="${ constants.EMAIL_TEMPLATE_YIN_URL }" height="25px"
    //                                                                           style="cursor: pointer" />
    //                                                                   </a>
    //                                                               </td>
    //                                                           </tr>
    //                                                       </tbody>
    //                                                   </table>
    //                                               </td>
    //                                           </tr>
    //                                           <!-- END FOOTER -->
    //                               </td>
    //                           </tr>
    //                           </tbody>
    //                       </table>
    //               </td>
    //           </tr>

    //           <!-- END MAIN CONTENT AREA -->
    //       </table>
    //       <!-- END CENTERED WHITE CONTAINER -->
    //       </div>
    //       </td>

    //       <!-- Extra TD -->
    //       <td style="font-size: 16px; vertical-align: top;" valign="top">&nbsp;
    //       </td>
    //       </tr>
    //       </table>
    //   </body>

    //   </html>
    // `;
    return await `
    <!DOCTYPE html>
  <html lang="en">

<body style="margin: 0; padding: 0">
  <div style="max-width: 30rem; margin: auto">
    <div style="height: 100px; text-align: center; padding: 15px 0">
      <a style="text-decoration: none; cursor: pointer" href=" ${ constants.EMAIL_BASE_URL }" target="_blank">
        <img src="${ constants.EMAIL_TEMPLATE_VALOGO_URL }" style="height: 100%" />
      </a>
    </div>
    <div>
      <img src="${ constants.EMAIL_TEMPLATE_HERO4_URL }" style="height: 100%; width: 100%" />
    </div>
    <div style="text-align: center; padding: 20px 0">
      <button style="
            background-color: #032b4e;
            color: #fff;
            font-size: 22px;
            cursor: pointer;
            font-weight: bold;
            padding: 2px;
            border: solid 3px #032b4e;
            border-radius: 0.9rem;
            background-clip: content-box;
            font-family: sans-serif;
            height: 50px;
            width: 200px;
            margin: 1rem 0;
          ">
        Reset Password
      </button>
    </div>
    <table style="width: 100%; background: #fbaa2d; padding: 10px 20px">
      <tbody style="width: 100%">
        <tr>
          <td style="vertical-align: middle; width: 50%">
            <div style="width: 8rem">
              <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }"
                target="_blank">
                <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }" style="width: 100%; height: 100%" />
              </a>
            </div>
            <div style="width: 8rem; margin-top: 1rem">
              <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }"
                target="_blank">
                <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" style="width: 100%; height: 100%" />
              </a>
            </div>
          </td>
          <td style="vertical-align: top; text-align: right; width: 50%">
            <div style="padding-bottom: 10px">
              <a href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank"
                style="text-decoration: none; color: #032b4e; cursor: pointer">${ constants.EMAIL_TEMPLATE_MAIL_ID }
                <span style="vertical-align: middle">
                  <img src="${ constants.EMAIL_TEMPLATE_YMAIL_URL }"
                    style="width: 25px; height: 25px; padding-left: 7px" />
                </span>
              </a>
            </div>
            <div>
              <a href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }"
                style="text-decoration: none; color: #032b4e; cursor: pointer">${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                <span style="vertical-align: middle">
                  <img src="${ constants.EMAIL_TEMPLATE_YPHONE_URL }"
                    style="width: 25px; height: 25px; padding-left: 7px" />
                </span>
              </a>
            </div>
            <div>
              <p>
                <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YWEB_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src=" ${ constants.EMAIL_TEMPLATE_YFB_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YTWITTER_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YINSTA_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YYT_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank"
                  style="text-decoration: none; cursor: pointer">
                  <img src="${ constants.EMAIL_TEMPLATE_YIN_URL }" style="width: 25px; height: 25px" />
                </a>
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>
</html>
    `
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
        <p style="font-weight:400;font-size:15px;color: white;">For further information and updates, please visit our website: <a href="` + constants.EMAIL_BASE_URL + `" style="color: #fe8b00 !important;"> ` + constants.EMAIL_BASE_URL + `</a></p>
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
//   const header = await this.templateHeader(data);
//   const footer = await this.templateFooter(data);
//   const courseUrl = data?.course_id
//     ? constants.EMAIL_COURSE_URL + data.course_id
//     : process.env.BASE_URL;
//   return (
//     (await `${header}
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;"> Dear,
//         `) +
//     data.user_name +
//     `</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">Congratulations on your recent purchase of the College UPSC - Level 1 course on Virtual Afsar! We're thrilled to embark on this educational journey with you.</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">Your account under the username "${data.user_name}" has been successfully created, granting you access to a world of learning opportunities to excel in your UPSC preparations.</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">To commence your learning experience, kindly log in to the Virtual Afsar Platform using the button below:</p>
//     </div>
//     <div style="padding:0 20px; display: flex; justify-content: center;">
//         <a href="` +
//     courseUrl +
//     `"
//             style="display:block;width:13.125rem;height:3.5rem;text-decoration:none;text-transform:uppercase;display:flex;justify-content:center;align-items:center;background-color:#0076cb;border-radius:2rem">
//             <div style="font-style:normal;font-weight:600;font-size:16px;color:#fff;margin:auto;text-align:center;position:absolute;line-height:24px"> Go To Course</div>
//         </a>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">We've meticulously designed a comprehensive product tour explicitly tailored to introduce you to our platform's features. This tour aims to ensure you leverage our resources to their fullest potential.</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">Should you have any questions or need assistance while getting started, our dedicated support team is available to assist you. Feel free to reach out by replying to this email or contacting our support staff directly.</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">Stay connected with us! Follow our social media channels for additional study tips, updates, and engaging content:</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">Additionally, stay connected with us on our social media channels for updates, tips, and more:</p>
//     </div>
    
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">For further information and updates, please visit our website: <a href="` + constants.EMAIL_BASE_URL + `" style="color: #fe8b00 !important;"> ` + constants.EMAIL_BASE_URL + `</a> </p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">Thank you for choosing Virtual Afsar as your partner in achieving your UPSC goals. We're committed to providing you with the guidance and resources needed for success.</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">Welcome aboard, and let's begin this enriching learning journey together!</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px;color: white;">Best regards,</p>
//         <p style="font-weight:400;font-size:15px;color: white;">Virtual Afsar Team</p>
//     </div>

//     ${footer}
//     `
//   );
// };
// // ---- COURSE PURCHASED TEMPLATE (END) ----

// module.exports.courseSubscription = async (data) => {
//   const header = await this.templateHeader(data);
//   const footer = await this.templateFooter(data);
//   return (
//     (await `${header}
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px">🎁 You're In! Subscription Confirmation for `) +
//     data.course_name +
//     `</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px">Hey ` +
//     data.user_name +
//     `,</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px">Hooray! You've successfully subscribed to the ` +
//     data.course_name +
//     ` package. 🎁 Now, you've got the key to unlimited access to our ` +
//     data.course_name +
//     `.</p>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px">Kickstart your learning adventure now:</p>
//     </div>
//     <div style="padding:0 20px; display: flex; justify-content: center;">
//         <a href="` +
//     data.link +
//     `"
//             style="display:block;width:13.125rem;height:3.5rem;text-decoration:none;text-transform:uppercase;display:flex;justify-content:center;align-items:center;background-color:#0076cb;border-radius:2rem">
//             <div style="font-style:normal;font-weight:600;font-size:16px;color:#fff;margin:auto;text-align:center;position:absolute;line-height:24px">Login</div>
//         </a>
//     </div>
//     <div style="padding:0 20px">
//         <p style="font-weight:400;font-size:15px">Happy learning,</p>
//     </div>
//     ${footer}`
//   );

  //     return await `
  //     <html>
  //   <head>
  //     <link rel="preconnect" href="https://fonts.googleapis.com" />
  //     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  //     <link
  //       href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
  //       rel="stylesheet"
  //     />
  //     <style>
  //       p {
  //         font-family: "Josefin Sans", sans-serif;
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <div
  //       style="
  //         padding: 0.625rem;
  //         width: 37.3rem;
  //         margin: 0;
  //         position: relative;
  //         margin-left: -18px;
  //         margin-top: 50px;
  //         margin-bottom: 50px;
  //       "
  //     >
  //       <div
  //         style="
  //           height: 29rem;
  //           background-color: #0e5f9f;
  //           padding-top: 1rem;
  //           padding-bottom: 1rem;
  //           padding-right: 1rem;
  //           width: 10rem;
  //           position: absolute;
  //           top: 4rem;
  //           display: flex;
  //           flex-direction: column;
  //           justify-content: space-between;
  //           align-items: center;
  //           margin-top: 25px;
  //         "
  //       >
  //         <div style="width: 100%">
  //           <div style="text-align: right">
  //             <p
  //               style="
  //                 font-size: 12px;
  //                 font-weight: 900;
  //                 color: #c3e7f5;
  //                 margin: 0;
  //               "
  //             >
  //               INVOICE NO:
  //             </p>
  //             <p
  //               style="
  //                 font-size: 12px;
  //                 font-weight: 400;
  //                 color: #fff;
  //                 margin: 0;
  //                 padding-top: 2px;
  //               "
  //             >
  //               ${data.invoice_id}
  //             </p>
  //           </div>
  //           <div style="text-align: right; margin-top: 1rem">
  //             <p
  //               style="
  //                 font-size: 12px;
  //                 font-weight: bold;
  //                 color: #c3e7f5;
  //                 margin: 0;
  //               "
  //             >
  //               INVOICE DATE:
  //             </p>
  //             <p
  //               style="
  //                 font-size: 12px;
  //                 font-weight: 400;
  //                 color: #fff;
  //                 margin: 0;
  //                 padding-top: 2px;
  //               "
  //             >
  //               ${data.issue_data}
  //             </p>
  //           </div>
  //           <div style="text-align: right; margin-top: 1rem">
  //             <p
  //               style="
  //                 font-size: 12px;
  //                 font-weight: bold;
  //                 color: #c3e7f5;
  //                 margin: 0;
  //               "
  //             >
  //               ISSUED TO:
  //             </p>
  //             <p
  //               style="
  //                 font-size: 12px;
  //                 font-weight: bold;
  //                 color: #fff;
  //                 margin: 0;
  //                 padding-top: 4px;
  //               "
  //             >
  //               ${ data?.username || "N/A" }
  //             </p>
  //             <p
  //               style="
  //                 font-size: 11px;
  //                 font-weight: 400;
  //                 color: #fff;
  //                 margin: 0;
  //                 padding-top: 5px;
  //               "
  //             >
  //               ${ data?.mobile_no || "N/A" }
  //             </p>
  //           </div>
  //         </div>
  //         <div
  //           style="
  //             background-color: #c3e7f5;
  //             border-radius: 50%;
  //             width: 5rem;
  //             height: 5rem;
  //             margin-top: 11rem;
  //             margin-bottom: 2rem;
  //             margin-left: 2rem;
  //             margin-right: auto;
  //             padding: 0.8rem;
  //             text-align: center;
  //           "
  //         >
  //           <img
  //             src="${ constants.INVOICE_VICON_IMAGE }"
  //             style="width: 4rem; height: 5rem"
  //           />
  //         </div>
  //       </div>
  //       <div
  //         style="
  //           padding-top: 1rem;
  //           width: 31rem;
  //           margin-left: 100px;
  //           background-color: #c3e7f5;
  //         "
  //       >
  //         <div
  //           style="
  //             display: flex;
  //             align-items: center;
  //             justify-content: space-between;
  //             padding: 0 2rem;
  //           "
  //         >
  //           <table style="width: 100%">
  //             <tbody style="width: 100%">
  //               <tr>
  //                 <td style="vertical-align: top">
  //                   <p
  //                     style="
  //                       font-size: 1.8rem;
  //                       font-weight: 900;
  //                       color: #123e6f;
  //                       letter-spacing: 2;
  //                       margin: 0;
  //                     "
  //                   >
  //                     I N V O I C E
  //                   </p>
  //                 </td>
  //                 <td style="text-align: end">
  //                   <img
  //                     src="${ constants.INVOICE_VALOGO_IMAGE }"
  //                     style="width: 9.5rem; height: 5.5rem"
  //                   />
  //                 </td>
  //               </tr>
  //             </tbody>
  //           </table>
  //         </div>

  //         <div style="width: 26.2rem; margin-left: auto; overflow: hidden">
  //           <table style="width: 100%; margin-bottom: 1rem">
  //             <tbody style="width: 100%">
  //               <tr>
  //                 <td style="vertical-align: top; padding: 0; width: 50%">
  //                   <table style="width: 100%">
  //                     <tbody style="width: 100%">
  //                       <tr>
  //                         <td style="vertical-align: top">
  //                           <img
  //                             src="${ constants.INVOICE_LOCATION_IMAGE }"
  //                             style="
  //                               width: 6px;
  //                               height: 6px;
  //                               background-color: #123e6f;
  //                               border-radius: 50%;
  //                               padding: 2px;
  //                             "
  //                           />
  //                         </td>
  //                         <td>
  //                           <p
  //                             style="
  //                               color: #123e6f;
  //                               font-weight: 400;
  //                               margin: 0;
  //                               font-size: 9px;
  //                               text-align: left;
  //                             "
  //                           >
  //                             ${ constants.EMAIL_TEMPLATE_ADDRESS }
  //                           </p>
  //                         </td>
  //                       </tr>
  //                     </tbody>
  //                   </table>
  //                 </td>
  //                 <td style="padding: 0; width: 50%">
  //                   <p
  //                     style="
  //                       color: #123e6f;
  //                       font-weight: 400;
  //                       margin: 0;
  //                       font-size: 9px;
  //                       text-align: left;
  //                     "
  //                   >
  //                     <span style="vertical-align: middle">
  //                       <img
  //                         src="${ constants.INVOICE_PHONE_IMAGE }"
  //                         style="
  //                           width: 6px;
  //                           height: 6px;
  //                           background-color: #123e6f;
  //                           border-radius: 50%;
  //                           padding: 2px;
  //                           margin-right: 0.3rem;
  //                         "
  //                       />
  //                     </span>
  //                     Tel : ${ constants.EMAIL_TEMPLATE_MOBILE_NO }
  //                   </p>
  //                   <p style="margin: 5px 0">
  //                     <a
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0;
  //                         font-size: 9px;
  //                         text-align: left;
  //                         text-decoration: none;
  //                       "
  //                       href="https://virtualafsar.com"
  //                     >
  //                       <span>
  //                         <img
  //                           src="${ constants.INVOICE_WEB_IMAGE }"
  //                           style="
  //                             width: 6px;
  //                             height: 6px;
  //                             background-color: #123e6f;
  //                             border-radius: 50%;
  //                             padding: 2px;
  //                             margin-right: 0.3rem;
  //                           "
  //                         />
  //                       </span>
  //                       Web : https://virtualafsar.com
  //                     </a>
  //                   </p>
  //                   <p style="margin: 0">
  //                     <a
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0;
  //                         font-size: 9px;
  //                         text-align: left;
  //                         text-decoration: none;
  //                       "
  //                       href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }"
  //                     >
  //                       <span>
  //                         <img
  //                           src="${ constants.INVOICE_MAIL_IMAGE }"
  //                           style="
  //                             width: 6px;
  //                             height: 6px;
  //                             background-color: #123e6f;
  //                             border-radius: 50%;
  //                             padding: 2px;
  //                             margin-right: 0.3rem;
  //                           "
  //                         />
  //                       </span>
  //                       Email : ${ constants.EMAIL_TEMPLATE_MAIL_ID }
  //                     </a>
  //                   </p>
  //                 </td>
  //               </tr>
  //             </tbody>
  //           </table>
  //           <table style="width: 100%; border-collapse: collapse">
  //             <tbody>
  //               <tr style="width: 100%">
  //                 <td
  //                   style="
  //                     border-right: 0.0625rem solid #0e5f9f;
  //                     border-top: 0.0625rem solid #0e5f9f;
  //                     text-align: center;
  //                     padding: 0.3125rem 0.625rem;
  //                     border-bottom: none;
  //                     flex: 1;
  //                   "
  //                 >
  //                   <p
  //                     style="
  //                       color: #123e6f;
  //                       font-weight: 900;
  //                       margin: 0;
  //                       font-size: 11px;
  //                     "
  //                   >
  //                     COURSE NAME
  //                   </p>
  //                 </td>

  //                 <td
  //                   style="
  //                     border-right: 0.0625rem solid #0e5f9f;
  //                     border-top: 0.0625rem solid #0e5f9f;
  //                     text-align: center;
  //                     padding: 0.3125rem 0.625rem;
  //                     border-bottom: none;
  //                     flex: 1;
  //                   "
  //                 >
  //                   <p
  //                     style="
  //                       color: #123e6f;
  //                       font-weight: 900;
  //                       margin: 0;
  //                       font-size: 11px;
  //                     "
  //                   >
  //                     PARTICULARS
  //                   </p>
  //                 </td>

  //                 <td
  //                   style="
  //                     text-align: center;
  //                     padding: 0.3125rem 0.5625rem 0.3125rem 0.625rem;
  //                     border-right: none;
  //                     border-top: 0.0625rem solid #0e5f9f;
  //                     flex: 0.5;
  //                   "
  //                 >
  //                   <p
  //                     style="
  //                       color: #123e6f;
  //                       font-weight: 900;
  //                       margin: 0;
  //                       font-size: 11px;
  //                     "
  //                   >
  //                     AMOUNT
  //                   </p>
  //                 </td>
  //               </tr>

  //               <tr style="width: 100%">
  //                 <td
  //                   style="
  //                     border: 0.0625rem solid #0e5f9f;
  //                     padding: 0.3125rem 0.625rem;
  //                     border-left: none;
  //                     vertical-align: top;
  //                     border-bottom: none;
  //                   "
  //                 >
  //                   <p
  //                     style="
  //                       color: #123e6f;
  //                       font-weight: 400;
  //                       margin: 0;
  //                       font-size: 11px;
  //                       padding-top: 2;
  //                       text-align: center;
  //                     "
  //                   >
  //                     ${ data?.course_title || "N/A" }
  //                   </p>
  //                 </td>

  //                 <td
  //                   style="
  //                     border: 0.0625rem solid #0e5f9f;
  //                     width: 7rem;
  //                     border-left: none;
  //                     padding: 0.3125rem 0.625rem;
  //                     vertical-align: top;
  //                     border-bottom: none;
  //                   "
  //                 >
  //                   <div style="width: 6.5rem">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 800;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       Price
  //                     </p>
  //                   </div>

  //                   <div style="width: 6.5rem">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 800;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       Discount (${ data?.discount || 0 }%)
  //                     </p>
  //                   </div>

  //                   <div style="width: 6.5rem">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 800;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       Sub Total
  //                     </p>
  //                   </div>

  //                   <div style="width: 6.5rem">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 800;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       Coupon Amount
  //                     </p>
  //                   </div>

  //                   <div style="width: 6.5rem">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 800;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       Referral Discount
  //                     </p>
  //                   </div>

  //                   <div style="width: 6.5rem">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 800;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       GST (${ data?.tax_percentage || 0 }%)
  //                     </p>
  //                   </div>

  //                   <div style="width: 6.5rem">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 800;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       Convenience Fees (${ data?.convince_fee || 0 }%)
  //                     </p>
  //                   </div>
  //                 </td>

  //                 <td
  //                   style="
  //                     border: 0.0625rem solid #0e5f9f;
  //                     border-bottom: none;
  //                     padding: 0.3125rem 0.625rem;
  //                     text-align: center;
  //                     border-left: none;
  //                     border-right: none;
  //                     vertical-align: top;
  //                   "
  //                 >
  //                   <div>
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0 auto;
  //                         font-size: 11px;
  //                         width: max-content;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       ${ data?.course_base_price || 0 }/-
  //                     </p>
  //                   </div>

  //                   <div>
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0 auto;
  //                         font-size: 11px;
  //                         width: max-content;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       ${ data?.discount_amount || 0 }/-
  //                     </p>
  //                   </div>

  //                   <div>
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0 auto;
  //                         font-size: 11px;
  //                         width: max-content;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       ${ data?.discount_amount || 0 }/-
  //                     </p>
  //                   </div>

  //                   <div>
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0 auto;
  //                         font-size: 11px;
  //                         width: max-content;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       ${ data?.coupon_amount || 0 }/-
  //                     </p>
  //                   </div>

  //                   <div>
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0 auto;
  //                         font-size: 11px;
  //                         width: max-content;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       ${ data?.heman_discount_amount || 0 }/-
  //                     </p>
  //                   </div>

  //                   <div>
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0 auto;
  //                         font-size: 11px;
  //                         width: max-content;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       ${ data?.tax_amount || 0 }/-
  //                     </p>
  //                   </div>

  //                   <div>
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: 400;
  //                         margin: 0 auto;
  //                         font-size: 11px;
  //                         width: max-content;
  //                         padding-top: 4px;
  //                       "
  //                     >
  //                       ${ data?.convince_fee_amount || 0 }/-
  //                     </p>
  //                   </div>

  //                   <div style="height: 140px"></div>
  //                 </td>
  //               </tr>
  //             </tbody>
  //           </table>
  //           <table
  //             style="
  //               width: 97%;
  //               border-top: 0.0625rem solid #0e5f9f;
  //               border-bottom: 0.0625rem solid #0e5f9f;
  //               margin-left: 5px;
  //             "
  //           >
  //             <tbody style="width: 100%">
  //               <tr>
  //                 <td style="vertical-align: middle">
  //                   <p
  //                     style="
  //                       color: #123e6f;
  //                       font-weight: bold;
  //                       margin: 0;
  //                       font-size: 14px;
  //                     "
  //                   >
  //                     GRAND TOTAL
  //                   </p>
  //                 </td>
  //                 <td style="vertical-align: middle">
  //                   <p
  //                     style="
  //                       color: #123e6f;
  //                       font-weight: bold;
  //                       margin: 0;
  //                       font-size: 14px;
  //                       text-align: end;
  //                     "
  //                   >
  //                     <span style="vertical-align: bottom">
  //                       <img
  //                         src="`+ constants.INVOICE_RUPEE_IMAGE + `"
  //                         style="width: 14px; height: 14px"
  //                       />
  //                     </span>
  //                     ${ data?.amount || 0 }/-
  //                   </p>
  //                 </td>
  //               </tr>
  //             </tbody>
  //           </table>
  //           <div style="margin-top: 1rem; padding-left: 1rem">
  //             <table style="width: 100%">
  //               <tbody style="width: 100%">
  //                 <tr>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: bold;
  //                         margin: 0;
  //                         font-size: 11px;
  //                       "
  //                     >
  //                       Bank Name
  //                     </p>
  //                   </td>
  //                   <td style="width: 100px; padding: 0">
  //                     <p style="color: #123e6f; margin: 0; font-size: 11px">
  //                       ICICI Bank
  //                     </p>
  //                   </td>
  //                 </tr>
  //                 <tr>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: bold;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 2px;
  //                       "
  //                     >
  //                       Branch Name
  //                     </p>
  //                   </td>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 2px;
  //                       "
  //                     >
  //                       Kalawad Road
  //                     </p>
  //                   </td>
  //                 </tr>
  //                 <tr>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: bold;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 2px;
  //                       "
  //                     >
  //                       Bank Account Number
  //                     </p>
  //                   </td>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 2px;
  //                       "
  //                     >
  //                       624805017419
  //                     </p>
  //                   </td>
  //                 </tr>
  //                 <tr>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: bold;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 2px;
  //                       "
  //                     >
  //                       Bank Branch IFSC
  //                     </p>
  //                   </td>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 2px;
  //                       "
  //                     >
  //                       ICIC0006248
  //                     </p>
  //                   </td>
  //                 </tr>
  //                 <tr>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         font-weight: bold;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 2px;
  //                       "
  //                     >
  //                       HSN Number
  //                     </p>
  //                   </td>
  //                   <td style="width: 100px; padding: 0">
  //                     <p
  //                       style="
  //                         color: #123e6f;
  //                         margin: 0;
  //                         font-size: 11px;
  //                         padding-top: 2px;
  //                       "
  //                     >
  //                       9 9 9 2 9 4
  //                     </p>
  //                   </td>
  //                 </tr>
  //               </tbody>
  //             </table>
  //           </div>
  //         </div>
  //         <div
  //           style="
  //             padding-top: 1rem;
  //             padding-bottom: 0.5rem;
  //             width: 100%;
  //             text-align: center;
  //             margin-top: 5rem;
  //           "
  //         >
  //           <p
  //             style="
  //               color: #123e6f;
  //               font-weight: bold;
  //               margin: 0;
  //               font-size: 11px;
  //             "
  //           >
  //             THANK YOU FOR SUBSCRIBING TO OUR COURSE
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </body>
  // </html>

    
  // `

  return await `
  <!DOCTYPE html>
<html lang="en">

<body style="margin: 0; padding: 0">
  <div style="max-width: 30rem; margin: auto">
    <div style="height: 100px; text-align: center; padding: 15px 0">
      <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_BASE_URL }" target="_blank">
        <img src="${ constants.EMAIL_TEMPLATE_VALOGO_URL }" style="height: 100%" />
      </a>
    </div>
    <div style="width: 100%; text-align: center; position: relative">
      <p style="
            text-align: center;
            margin: 0;
            font-size: 30px;
            width: 100%;
            color: #fff;
            z-index: 999;
            position: absolute;
            top: 4.6rem;
            font-weight: bold
          ">
        #Name_Surname
      </p>
      <img src="${ constants.EMAIL_TEMPLATE_HERO2_URL }" style="width: 100%; height: 100%" />
    </div>
    <div style="text-align: center; padding: 0rem 3rem; margin-bottom: 1rem;">
      <img src="${ constants.EMAIL_TEMPLATE_YELLOWTODO_URL }" style="width: 100%; height: 100%" />
    </div>
    <div style="text-align: center; padding: 20px 0; padding-top: 0">
    <a href="${constants.EMAIL_COURSE_URL}" target="_blank"
    style="text-decoration: none;">
      <button style="
            height: fit-content;
            background-color: #032b4e;
            color: #fff;
            font-size: 22px;
            cursor: pointer;
            font-weight: bold;
            border: solid 3px #032b4e;
            border-radius: 1rem;
            font-family: sans-serif;
            height: 50px;
            width: 200px;
            margin-bottom: .5rem;
          ">
        Go To Course
      </button>
      </a>
    </div>
    <div style="text-align: center; margin-bottom: -4px">
      <img src="${ constants.EMAIL_TEMPLATE_HINDITXT_URL }" style="width: 100%; height: 100%" />
    </div>
    <table style="width: 100%; background: #fbaa2d; padding: 10px 20px">
      <tbody style="width: 100%">
        <tr>
          <td style="vertical-align: middle; width: 50%">
            <div style="width: 8rem">
              <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }"
                target="_blank">
                <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }" style="width: 100%; height: 100%" />
              </a>
            </div>
            <div style="width: 8rem; margin-top: 1rem">
              <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }"
                target="_blank">
                <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" style="width: 100%; height: 100%" />
              </a>
            </div>
          </td>
          <td style="vertical-align: top; text-align: right; width: 50%">
            <div style="padding-bottom: 10px">
              <a href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank"
                style="text-decoration: none; color: #032b4e; cursor: pointer">${ constants.EMAIL_TEMPLATE_MAIL_ID }
                <span style="vertical-align: middle">
                  <img src="${ constants.EMAIL_TEMPLATE_YMAIL_URL }"
                    style="width: 25px; height: 25px; padding-left: 7px" />
                </span>
              </a>
            </div>
            <div>
              <a href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }"
                style="text-decoration: none; color: #032b4e; cursor: pointer">${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                <span style="vertical-align: middle">
                  <img src="${ constants.EMAIL_TEMPLATE_YPHONE_URL }"
                    style="width: 25px; height: 25px; padding-left: 7px" />
                </span>
              </a>
            </div>
            <div>
              <p>
                <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YWEB_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src=" ${ constants.EMAIL_TEMPLATE_YFB_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YTWITTER_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YINSTA_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="
                      text-decoration: none;
                      padding-right: 7px;
                      cursor: pointer;
                    ">
                  <img src="${ constants.EMAIL_TEMPLATE_YYT_URL }" style="width: 25px; height: 25px" />
                </a>
                <a href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank"
                  style="text-decoration: none; cursor: pointer">
                  <img src="${ constants.EMAIL_TEMPLATE_YIN_URL }" style="width: 25px; height: 25px" />
                </a>
              </p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</body>

</html>
  `
};

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
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Active Users</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.todayActiveUsersData}</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Referral Traffic</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.todayReferral}</td>
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
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">Video Views</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.todayWatchVideo
                    }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">Video Completion</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.todayCompletedVideo
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
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Paid Subscriptions</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayRevenueData?.user_count || 0
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
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">17 - 28</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.second_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">28 - 45</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.third_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">45+</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.forth_range_count || 0
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

module.exports.weeklySnapshot = async (data) => {
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
              element?.stateLastSevrnDayDistribution || 0
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
              element?.cityLastSevrnDayDistribution || 0
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
                font-family: Montserrat, sans-serif;">Admin Insights: A Weekly Snapshot</p>
            </div>
    
            
            <table style="color: rgba(76, 78, 100, 0.87); width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="border: 1px solid #e8e8eb;">
                    <th style="padding: 8px; border: 1px solid #e8e8eb; font-size: 1rem;color: black; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Metrics</strong></th>
                    <th style="padding: 8px; border: 1px solid #e8e8eb; font-size: 1rem;color: black; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Monthly</strong></th>
                
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
        font-family: Montserrat, sans-serif;">${data.lastSevrnDaySignup}</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Active Users</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data.lastSevrnDayActiveUsersData
        }</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Referral Traffic</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.lastSevrnDayReferral}</td>
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
          data.lastSevrnDaySessionDurationsData
        }</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">Video Views</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.lastSevrnDayWatchVideo
                    }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">Video Completion</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.lastSevrnDayCompletedVideo
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
          data?.lastSevrnDayRevenueData?.amount || 0
        }</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Paid Subscriptions</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayRevenueData?.user_count || 0
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
          data?.lastSevrnDayAgeRagngeData?.first_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">17 - 28</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayAgeRagngeData?.second_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">28 - 45</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayAgeRagngeData?.third_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">45+</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.lastSevrnDayAgeRagngeData?.forth_range_count || 0
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

module.exports.monthlySnapshot = async (data) => {
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
                font-family: Montserrat, sans-serif;">Admin Insights: A Monthly Snapshot</p>
            </div>
    
            
            <table style="color: rgba(76, 78, 100, 0.87); width: 100%; border-collapse: collapse; margin-top: 10px;">
                <tr style="border: 1px solid #e8e8eb;">
                    <th style="padding: 8px; border: 1px solid #e8e8eb; font-size: 1rem;color: black; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Metrics</strong></th>
                    <th style="padding: 8px; border: 1px solid #e8e8eb; font-size: 1rem;color: black; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;"><strong>Today</strong></th>
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
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Active Users</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.todayActiveUsersData}</td>
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Referral Traffic</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${data.todayReferral}</td>
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
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">Video Views</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.todayWatchVideo
                    }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">Video Completion</td>
                                <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
                    font-family: Montserrat, sans-serif;">${
                      data.todayCompletedVideo
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
                </tr>
                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">Paid Subscriptions</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayRevenueData?.user_count || 0
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
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">17 - 28</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.second_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">28 - 45</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.third_range_count || 0
        }</td>
                </tr>

                <tr style="border: 1px solid #e8e8eb;">
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">45+</td>
                    <td style="padding: 8px; border: 1px solid #e8e8eb; font-size: 0.9rem; font-weight: 500; text-align: left;  @importurl ('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@500;0,&display=swap');
        font-family: Montserrat, sans-serif;">${
          data?.todayAgeRagngeData?.forth_range_count || 0
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
