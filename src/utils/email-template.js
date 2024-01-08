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
  return await `
  <!DOCTYPE html>
  <html lang="en">
  
  <body style="margin: 0; padding: 0;">
    <div style="max-width: 30rem; margin: auto;">
      <div style="text-align: center; line-height: 0;">
        <a style="text-decoration: none; cursor: pointer" href=" ${ constants.EMAIL_BASE_URL }" target="_blank">
          <img src="${ constants.EMAIL_TEMPLATE_LOGOGIF_URL }" style="height: auto; width: 100%;" />
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
      <div style="text-align: center; margin: 0;padding: 0 ; line-height: 0;">
        <img src="${ constants.EMAIL_TEMPLATE_BOYMOBILE_URL }" style="width: 100%; height: 100%;" />
      </div>
      <table style="width: 100%; background: #032b4e; padding: 5px 20px;">
        <tbody style="width: 100%">
          <tr>
            <td style="vertical-align: middle; width: 40%">
              <div style="width: 6rem; height: 1.8rem;">
                <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }">
                  <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }" style="width: 100%; height: 100%" />
                </a>
              </div>
              <div style="width: 6rem; margin-top: 0.4rem; height: 1.8rem;">
                <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }">
                  <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" style="width: 100%; height: 100%" />
                </a>
              </div>
            </td>
            <td style="vertical-align: top; text-align: right; width: 60%">
              <div style="padding-bottom: 5px">
                <a style="text-decoration: none; color: #fff; cursor: pointer"
                  href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank">
                  ${ constants.EMAIL_TEMPLATE_MAIL_ID}
                  <span style="vertical-align: middle">
                    <img src="${ constants.EMAIL_TEMPLATE_MAIL_URL }"
                      style="width: 20px; height: 20px; padding-left: 7px" />
                  </span>
                </a>
              </div>
              <div>
                <a style="text-decoration: none; color: #fff; cursor: pointer"
                  href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }">
                  ${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                  <span style="vertical-align: middle">
                    <img src="${ constants.EMAIL_TEMPLATE_PHONE_URL }"
                      style="width: 20px; height: 20px; padding-left: 7px" />
                  </span>
                </a>
              </div>
              <div>
                <p style="margin: 5px 0 0 0;">
                  <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src="${ constants.EMAIL_TEMPLATE_WEB_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src=" ${ constants.EMAIL_TEMPLATE_FB_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src="${ constants.EMAIL_TEMPLATE_TWITTER_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src="${ constants.EMAIL_TEMPLATE_INSTA_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src="${ constants.EMAIL_TEMPLATE_YT_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank"
                    style="text-decoration: none; cursor: pointer">
                    <img src="${ constants.EMAIL_TEMPLATE_IN_URL }" style="width: 20px; height: 20px" />
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

module.exports.welcomeWithCredetialsTemplate = async (data) => {
    return await `
    <!DOCTYPE html>
    <html lang="en">
    
    <body style="margin: 0; padding: 0">
      <div style="max-width: 30rem; margin: auto">
        <div style="text-align: center; line-height: 0;">
          <a href="${constants.EMAIL_BASE_URL}" target="_blank"
            style="color: #080202; text-decoration: none; cursor: pointer;">
            <img src="${constants.EMAIL_TEMPLATE_LOGOGIF_URL}" style="height: auto; width: 100%;" />
          </a>
        </div>
        <div style="background-color: #032b4e; padding: 5px; text-align: center;">
          <p style="
            font-family: sans-serif;
            font-size: 30px;  
            font-weight: bold;
            color: #f5a848;
            margin-bottom: 0;
            margin-top: 5px;
          ">
            Congratulations
          </p>
          <p style="
                font-family: sans-serif;
                font-size: 21px;         
                font-weight: bold;
                color: #fff;
                margin: 5px 0 0 0;
              ">${ data.name || ''}</p>
          <div style="margin-top: 25px;">
            <p style="
                font-family: sans-serif;
                font-size: 21px;         
                font-weight: bold;
                color: #fff;
                margin: 0;
                ">Hooray !</p>
            <p style="
               font-family: sans-serif;
               font-size: 21px;  
               font-weight: bold;
               color: #f5a848;
               margin: 0;
               margin-bottom: 20px;
               ">
              Payment successfully done.
            </p>
          </div>
        </div>
    
        <div
          style="text-align: center; background: url('${ constants.EMAIL_TEMPLATE_WHITEBG_URL }'); background-size: cover;">
          <div style="height: 100%; width: 100%; line-height: 0;">
            <img src="${ constants.EMAIL_TEMPLATE_WWCHERO_URL }" alt="" style="width: 100%; height: 100%;">
          </div>
    
          <div style="padding: 0 20px;  text-align: center; margin-bottom: 1.5rem;">
            <div style="border: 1px solid #032b4e; border-radius:30px; padding: 5px;">
              <p style="
            font-family: sans-serif;
            font-size: 25px;  
            margin: 10px;
            margin-bottom: 30px;
            font-weight: bold;
            color: #f5a848;
          ">
                Log in credentials:
              </p>
              <div>
                <p style="
                font-family: sans-serif;
                font-size: 20px;  
                font-weight: bold;
                color: #032b4e;
                margin: 0;
              ">Username:</p>
                <p style="
                font-family: sans-serif;
                font-size: 20px;         
                font-weight: bold;
                color: #032b4e;
                margin: 10px 0;
                
              ">${data.user_name || ''}</p>
                <p style="
                font-family: sans-serif;
                font-size: 20px;  
                margin: 10px;
                margin-bottom: 30px;
                font-weight: bold;
                color: #032b4e;
                margin: 0;
                ">Password:</p>
                <p style="
                font-family: sans-serif;
                font-size: 20px;         
                font-weight: bold;
                color: #032b4e;
                margin: 10px 0;">${data.password}</p>
              </div>
            </div>
          </div>
    
          <div style="text-align: center; margin-bottom: 1rem;">
            <img src="${ constants.EMAIL_TEMPLATE_YELLOWTODO_URL }" style="width: 100%; height: 100%" />
          </div>
          <div style="text-align: center; padding: 20px 0; padding-top: 0">
            <a href="https://virtualafsar.com/downloadApp/" target="_blank"
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
        </div>
    
        <div style="text-align: center; margin: 0;padding: 0 ; line-height: 0;">
          <img src="${ constants.EMAIL_TEMPLATE_HINDITXT_URL }" style="width: 100%; height: 100%" />
        </div>
        <table style="width: 100%; background: #fbaa2d; padding: 5px 20px;">
          <tbody style="width: 100%">
            <tr>
              <td style="vertical-align: middle; width: 40%">
                <div style="width: 6rem; height: 1.8rem;">
                  <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }">
                    <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }" style="width: 100%; height: 100%" />
                  </a>
                </div>
                <div style="width: 6rem; margin-top: 0.4rem; height: 1.8rem;">
                  <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }">
                    <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" style="width: 100%; height: 100%" />
                  </a>
                </div>
              </td>
              <td style="vertical-align: top; text-align: right; width: 60%">
                <div style="padding-bottom: 5px">
                  <a style="text-decoration: none; color: #fff; cursor: pointer"
                    href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank">
                    ${ constants.EMAIL_TEMPLATE_MAIL_ID}
                    <span style="vertical-align: middle">
                      <img src="${ constants.EMAIL_TEMPLATE_MAIL_URL }"
                        style="width: 20px; height: 20px; padding-left: 7px" />
                    </span>
                  </a>
                </div>
                <div>
                  <a style="text-decoration: none; color: #fff; cursor: pointer"
                    href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }">
                    ${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                    <span style="vertical-align: middle">
                      <img src="${ constants.EMAIL_TEMPLATE_PHONE_URL }"
                        style="width: 20px; height: 20px; padding-left: 7px" />
                    </span>
                  </a>
                </div>
                <div>
                  <p style="margin: 5px 0 0 0;">
                    <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="
                                text-decoration: none;
                                padding-right: 4px;
                                cursor: pointer;
                              ">
                      <img src="${ constants.EMAIL_TEMPLATE_WEB_URL }" style="width: 20px; height: 20px" />
                    </a>
                    <a href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="
                                text-decoration: none;
                                padding-right: 4px;
                                cursor: pointer;
                              ">
                      <img src=" ${ constants.EMAIL_TEMPLATE_FB_URL }" style="width: 20px; height: 20px" />
                    </a>
                    <a href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="
                                text-decoration: none;
                                padding-right: 4px;
                                cursor: pointer;
                              ">
                      <img src="${ constants.EMAIL_TEMPLATE_TWITTER_URL }" style="width: 20px; height: 20px" />
                    </a>
                    <a href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="
                                text-decoration: none;
                                padding-right: 4px;
                                cursor: pointer;
                              ">
                      <img src="${ constants.EMAIL_TEMPLATE_INSTA_URL }" style="width: 20px; height: 20px" />
                    </a>
                    <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="
                                text-decoration: none;
                                padding-right: 4px;
                                cursor: pointer;
                              ">
                      <img src="${ constants.EMAIL_TEMPLATE_YT_URL }" style="width: 20px; height: 20px" />
                    </a>
                    <a href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank"
                      style="text-decoration: none; cursor: pointer">
                      <img src="${ constants.EMAIL_TEMPLATE_IN_URL }" style="width: 20px; height: 20px" />
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
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <body style="margin: 0; padding: 0;">
    <div style="max-width: 30rem; margin: auto">
      <div style="text-align: center; line-height: 0;">
        <a style="text-decoration: none; cursor: pointer" href=" ${ constants.EMAIL_BASE_URL }" target="_blank">
          <img src="${ constants.EMAIL_TEMPLATE_LOGOGIF_URL }" style="height: auto; width: 100%;" />
        </a>
      </div>
      <div style="line-height: 0;">
        <img src="${ constants.EMAIL_TEMPLATE_HERO4_URL }" style="height: 100%; width: 100%" />
      </div>
      <div style="text-align: center; padding: 20px 0; background: url('${ constants.EMAIL_TEMPLATE_WHITEBG_URL }'); background-size: cover;">
        <a href="${ data.link }" target="_blank"
          style="text-decoration: none; cursor: pointer;">
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
        </a>
      </div>
      <table style="width: 100%; background: #fbaa2d; padding: 5px 20px">
        <tbody style="width: 100%">
          <tr>
            <td style="vertical-align: middle; width: 40%">
              <div style="width: 6rem; height: 1.8rem;">
                <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }"
                  target="_blank">
                  <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }" style="width: 100%; height: 100%" />
                </a>
              </div>
              <div style="width: 6rem; margin-top: 0.4rem; height: 1.8rem;">
                <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }"
                  target="_blank">
                  <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" style="width: 100%; height: 100%" />
                </a>
              </div>
            </td>
            <td style="vertical-align: top; text-align: right; width: 60%">
              <div style="padding-bottom: 5px">
                <a href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank"
                  style="text-decoration: none; color: #032b4e; cursor: pointer">${ constants.EMAIL_TEMPLATE_MAIL_ID }
                  <span style="vertical-align: middle">
                    <img src="${ constants.EMAIL_TEMPLATE_YMAIL_URL }"
                      style="width: 20px; height: 20px; padding-left: 7px" />
                  </span>
                </a>
              </div>
              <div>
                <a href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }"
                  style="text-decoration: none; color: #032b4e; cursor: pointer">${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                  <span style="vertical-align: middle">
                    <img src="${ constants.EMAIL_TEMPLATE_YPHONE_URL }"
                      style="width: 20px; height: 20px; padding-left: 7px" />
                  </span>
                </a>
              </div>
              <div>
                <p style="margin: 5px 0 0 0;">
                  <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="
                        text-decoration: none;
                        padding-right: 4px;
                        cursor: pointer;
                      ">
                    <img src="${ constants.EMAIL_TEMPLATE_YWEB_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="
                        text-decoration: none;
                        padding-right: 4px;
                        cursor: pointer;
                      ">
                    <img src=" ${ constants.EMAIL_TEMPLATE_YFB_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="
                        text-decoration: none;
                        padding-right: 4px;
                        cursor: pointer;
                      ">
                    <img src="${ constants.EMAIL_TEMPLATE_YTWITTER_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="
                        text-decoration: none;
                        padding-right: 4px;
                        cursor: pointer;
                      ">
                    <img src="${ constants.EMAIL_TEMPLATE_YINSTA_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="
                        text-decoration: none;
                        padding-right: 4px;
                        cursor: pointer;
                      ">
                    <img src="${ constants.EMAIL_TEMPLATE_YYT_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank"
                    style="text-decoration: none; cursor: pointer">
                    <img src="${ constants.EMAIL_TEMPLATE_YIN_URL }" style="width: 20px; height: 20px" />
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
  return await `<!DOCTYPE html>
  <html lang="en">
  
  <body style="margin: 0; padding: 0">
      <div style="max-width: 30rem; margin: auto">
          <div style="text-align: center; line-height: 0;">
              <a style="text-decoration: none; cursor: pointer" href=" ${ constants.EMAIL_BASE_URL }" target="_blank">
                  <img src="${ constants.EMAIL_TEMPLATE_LOGOGIF_URL }" style="height: auto; width: 100%;" />
              </a>
          </div>
          <div style="width: 100%; text-align: center;">
              <img src="${ constants.EMAIL_TEMPLATE_HERO1_URL }" style="width: 100%; height: 100%" />
          </div>
          <div style="text-align: center; padding: 15px 0">
              <p style="font-family: sans-serif; font-size: 30px; font-weight: 700; color: #f5a848; margin-bottom: 10px;">
                  Congratulations</p>
              <p style="font-family: sans-serif; font-size: 22px; color: #032b4e; margin: 0;font-weight: 600;">
                  ${data.name}</p>
              <p
                  style="font-size: 23px; text-align: center;font-family: sans-serif; font-weight: normal; color: #032b4e; margin: 50px 0; margin-bottom: 30px;">
                  By successfully enrolling, you have unlocked the beautiful journey
                  of become an officer.</p>
          </div>
          <div style="text-align: center;">
              <img src="${ constants.EMAIL_TEMPLATE_BLUETODO_URL }" style="width: 100%; height: 100%" />
          </div>
  
          <div style="line-height: 0">
              <img src="${ constants.EMAIL_TEMPLATE_COURSEUP_URL }" style="width: 100%; height: 100%; " />
          </div>
          <div style="background-color: #fcaa2e; text-align: center; line-height: 0; padding-top:25px;">
              <a href="https://virtualafsar.com/downloadApp/" target="_blank"
                  style="cursor: pointer;text-decoration: none;">
                  <button style="
          height: fit-content;
          background-color: #032b4e;
          color: #fcaa2e;
          font-size: 22px;
          cursor: pointer;
          font-weight: bold;
          border: solid 3px #032b4e;
          border-radius: 5rem;
          font-family: sans-serif;
          height: 50px;
          width: 230px;
        ">
                      GO TO COURSE
                  </button>
              </a>
          </div>
          <div style="line-height: 0;">
              <img src="${ constants.EMAIL_TEMPLATE_COURSEDOWN_URL }" style="width: 100%; height: 100%" />
          </div>
          <table style="width: 100%; background: #032b4e; padding: 5px 20px;">
              <tbody style="width: 100%">
                  <tr>
                      <td style="vertical-align: middle; width: 40%">
                          <div style="width: 6rem; height: 1.8rem;">
                              <a style="text-decoration: none; cursor: pointer"
                                  href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }">
                                  <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }"
                                      style="width: 100%; height: 100%" />
                              </a>
                          </div>
                          <div style="width: 6rem; margin-top: 0.4rem; height: 1.8rem;">
                              <a style="text-decoration: none; cursor: pointer"
                                  href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }">
                                  <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }"
                                      style="width: 100%; height: 100%" />
                              </a>
                          </div>
                      </td>
                      <td style="vertical-align: top; text-align: right; width: 60%">
                          <div style="padding-bottom: 5px">
                              <a style="text-decoration: none; color: #fff; cursor: pointer"
                                  href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank">
                                  ${ constants.EMAIL_TEMPLATE_MAIL_ID}
                                  <span style="vertical-align: middle">
                                      <img src="${ constants.EMAIL_TEMPLATE_MAIL_URL }"
                                          style="width: 20px; height: 20px; padding-left: 7px" />
                                  </span>
                              </a>
                          </div>
                          <div>
                              <a style="text-decoration: none; color: #fff; cursor: pointer"
                                  href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }">
                                  ${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                                  <span style="vertical-align: middle">
                                      <img src="${ constants.EMAIL_TEMPLATE_PHONE_URL }"
                                          style="width: 20px; height: 20px; padding-left: 7px" />
                                  </span>
                              </a>
                          </div>
                          <div>
                              <p style="margin: 5px 0 0 0;">
                                  <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="
                            text-decoration: none;
                            padding-right: 4px;
                            cursor: pointer;
                          ">
                                      <img src="${ constants.EMAIL_TEMPLATE_WEB_URL }"
                                          style="width: 20px; height: 20px" />
                                  </a>
                                  <a href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="
                            text-decoration: none;
                            padding-right: 4px;
                            cursor: pointer;
                          ">
                                      <img src=" ${ constants.EMAIL_TEMPLATE_FB_URL }"
                                          style="width: 20px; height: 20px" />
                                  </a>
                                  <a href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="
                            text-decoration: none;
                            padding-right: 4px;
                            cursor: pointer;
                          ">
                                      <img src="${ constants.EMAIL_TEMPLATE_TWITTER_URL }"
                                          style="width: 20px; height: 20px" />
                                  </a>
                                  <a href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="
                            text-decoration: none;
                            padding-right: 4px;
                            cursor: pointer;
                          ">
                                      <img src="${ constants.EMAIL_TEMPLATE_INSTA_URL }"
                                          style="width: 20px; height: 20px" />
                                  </a>
                                  <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="
                            text-decoration: none;
                            padding-right: 4px;
                            cursor: pointer;
                          ">
                                      <img src="${ constants.EMAIL_TEMPLATE_YT_URL }" style="width: 20px; height: 20px" />
                                  </a>
                                  <a href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank"
                                      style="text-decoration: none; cursor: pointer">
                                      <img src="${ constants.EMAIL_TEMPLATE_IN_URL }" style="width: 20px; height: 20px" />
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

};


module.exports.welcomeWithoutPaymentTemplate = async (data) => {
  return await `
  <!DOCTYPE html>
  <html lang="en">
  
  <body style="margin: 0; padding: 0">
    <div style="max-width: 30rem; margin: auto">
      <div style="text-align: center; line-height: 0;">
        <a href="${constants.EMAIL_BASE_URL}" target="_blank"
          style="color: #080202; text-decoration: none; cursor: pointer;">
          <img src="${constants.EMAIL_TEMPLATE_LOGOGIF_URL}" style="height: auto; width: 100%;" />
        </a>
      </div>
      <div style="background-color: #032b4e; padding: 5px; text-align: center; padding-bottom: 20px">
        <p style="
          font-family: sans-serif;
          font-size: 30px;  
          font-weight: bold;
          color: #f5a848;
          margin-bottom: 0;
          margin-top: 5px;
        ">
          Congratulations
        </p>
        <p style="
              font-family: sans-serif;
              font-size: 21px;         
              font-weight: bold;
              color: #fff;
              margin: 5px 0 0 0;
            ">${ data.name || ''}</p>
      </div>
  
      <div
        style="text-align: center; background: url('${ constants.EMAIL_TEMPLATE_WHITEBG_URL }'); background-size: cover;">
        <div style="height: 100%; width: 100%; line-height: 0;">
          <img src="${ constants.EMAIL_TEMPLATE_WWCHERO_URL }" alt="" style="width: 100%; height: 100%;">
        </div>
  
        <div style="padding: 0 20px;  text-align: center; margin-bottom: 1.5rem;">
          <div style="border: 1px solid #032b4e; border-radius:30px; padding: 5px;">
            <p style="
          font-family: sans-serif;
          font-size: 25px;  
          margin: 10px;
          margin-bottom: 30px;
          font-weight: bold;
          color: #f5a848;
        ">
              Log in credentials:
            </p>
            <div>
              <p style="
              font-family: sans-serif;
              font-size: 20px;  
              font-weight: bold;
              color: #032b4e;
              margin: 0;
            ">Username:</p>
              <p style="
              font-family: sans-serif;
              font-size: 20px;         
              font-weight: bold;
              color: #032b4e;
              margin: 10px 0;
              
            ">${data.user_name || ''}</p>
              <p style="
              font-family: sans-serif;
              font-size: 20px;  
              margin: 10px;
              margin-bottom: 30px;
              font-weight: bold;
              color: #032b4e;
              margin: 0;
              ">Password:</p>
              <p style="
              font-family: sans-serif;
              font-size: 20px;         
              font-weight: bold;
              color: #032b4e;
              margin: 10px 0;">${data.password}</p>
            </div>
          </div>
        </div>
  
        <div style="text-align: center;">
          <img src="${ constants.EMAIL_TEMPLATE_YELLOWTODO_URL }" style="width: 100%; height: 100%" />
        </div>
      </div>
  
      <div style="text-align: center; margin: 0;padding: 0 ; line-height: 0;">
        <img src="${ constants.EMAIL_TEMPLATE_HINDITXT_URL }" style="width: 100%; height: 100%" />
      </div>
      <table style="width: 100%; background: #fbaa2d; padding: 5px 20px;">
        <tbody style="width: 100%">
          <tr>
            <td style="vertical-align: middle; width: 40%">
              <div style="width: 6rem; height: 1.8rem;">
                <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_APP_STORE_URL }">
                  <img src="${ constants.EMAIL_TEMPLATE_APP_STORE_ICON_URL }" style="width: 100%; height: 100%" />
                </a>
              </div>
              <div style="width: 6rem; margin-top: 0.4rem; height: 1.8rem;">
                <a style="text-decoration: none; cursor: pointer" href="${ constants.EMAIL_TEMPLATE_PLAY_STORE_URL }">
                  <img src="${ constants.EMAIL_TEMPLATE_PLAY_STORE_ICON_URL }" style="width: 100%; height: 100%" />
                </a>
              </div>
            </td>
            <td style="vertical-align: top; text-align: right; width: 60%">
              <div style="padding-bottom: 5px">
                <a style="text-decoration: none; color: #fff; cursor: pointer"
                  href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }" target="_blank">
                  ${ constants.EMAIL_TEMPLATE_MAIL_ID}
                  <span style="vertical-align: middle">
                    <img src="${ constants.EMAIL_TEMPLATE_MAIL_URL }"
                      style="width: 20px; height: 20px; padding-left: 7px" />
                  </span>
                </a>
              </div>
              <div>
                <a style="text-decoration: none; color: #fff; cursor: pointer"
                  href="tel:${ constants.EMAIL_TEMPLATE_MOBILE_NO }">
                  ${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                  <span style="vertical-align: middle">
                    <img src="${ constants.EMAIL_TEMPLATE_PHONE_URL }"
                      style="width: 20px; height: 20px; padding-left: 7px" />
                  </span>
                </a>
              </div>
              <div>
                <p style="margin: 5px 0 0 0;">
                  <a href="${ constants.EMAIL_BASE_URL }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src="${ constants.EMAIL_TEMPLATE_WEB_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_FACEBOOK_LINK }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src=" ${ constants.EMAIL_TEMPLATE_FB_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_TWITTER_LINK }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src="${ constants.EMAIL_TEMPLATE_TWITTER_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_INSTAGRAM_LINK }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src="${ constants.EMAIL_TEMPLATE_INSTA_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_YOUTUBE_LINK }" target="_blank" style="
                              text-decoration: none;
                              padding-right: 4px;
                              cursor: pointer;
                            ">
                    <img src="${ constants.EMAIL_TEMPLATE_YT_URL }" style="width: 20px; height: 20px" />
                  </a>
                  <a href="${ constants.EMAIL_TEMPLATE_LINKEDIN_LINK }" target="_blank"
                    style="text-decoration: none; cursor: pointer">
                    <img src="${ constants.EMAIL_TEMPLATE_IN_URL }" style="width: 20px; height: 20px" />
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
}

module.exports.dailyReportTemplate = (getdata) => {
  const stateAndCityToday = getdata.stateAndCityToday;

  // Create the HTML content for the table
  const tableHtml = `
    <div style="max-width: 30rem; margin: auto">

    <!-- Today's Highlights Start -->
    <div
      style="
        border-radius: 15px;
        border: 1px solid #c0ccf7;
        box-shadow: 0px 0px 6.9px -1px #afdaff;
        margin: 25px 0;
      "
    >
      <div style="padding: 5px 20px 0 20px">
        <p
          style="
            font-family: sans-serif;
            font-size: 20px;
            font-weight: 500;
            color: #000;
            margin-bottom: 0;
            margin-top: 5px;
            padding-left: 5px;
            padding-top: 4px;
            border-left: 3px solid #00bf71;
          "
        >
          Today's Highlights :
        </p>
      </div>
      <hr color="#c0ccf7" />
      <div style="padding: 20px">
        <div
          style="border: 1px solid #c0ccf7; border-radius: 10px; padding: 6px"
        >
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              border-spacing: 30px;
            "
          >
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  New Sign-Ups
                </p>
              </th>
              <td style="text-align: right">
                <p
                  style="
                  padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                  ${getdata.todaySignup}
                </p>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Purchases Made
                </p>
              </th>
              <td style="text-align: right">
                <p
                  style="
                  padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                  ${getdata.todayPurchasesMade}
                </p>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Total Revenue Collected
                </p>
              </th>
              <td style="text-align: right">
                <p
                  style="
                  padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                  ${getdata.todayRevenueData.amount}
                </p>
              </td>
            </tr>
            <tr>
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Total Videos Viewed
                </p>
              </th>
              <td style="text-align: right">
                <p
                  style="
                  padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.todayWatchVideo}
                </p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- Today's Highlights End -->


    
    <!-- Overall Platform Statistics Start -->
    <div
      style="
        border-radius: 15px;
        border: 1px solid #c0ccf7;
        box-shadow: 0px 0px 6.9px -1px #afdaff;
        margin: 20px 0;
      "
    >
      <div style="padding: 5px 20px 0 20px">
        <p
          style="
            font-family: sans-serif;
            font-size: 20px;
            font-weight: normal;
            color: #000;
            margin-bottom: 0;
            margin-top: 5px;
            padding-left: 5px;
            padding-top: 4px;
            border-left: 3px solid #00bf71;
          "
        >
          Overall Platform Statistics :
        </p>
      </div>
      <hr color="#c0ccf7" />
      <div style="padding: 20px">
        <div
          style="border: 1px solid #c0ccf7; border-radius: 10px; padding: 6px"
        >
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              border-spacing: 30px;
            "
          >
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Total Users
                </p>
              </th>
              <td style="text-align: right">
                <p
                  style="
                  padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.totalUsers}
                </p>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Total Paid Users
                </p>
              </th>
              <td style="text-align: right">
                <p
                  style="
                  padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.totalPaidUsers}
                </p>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Total Unpaid Users
                </p>
              </th>
              <td style="text-align: right">
                <p
                  style="
                  padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.totalUnpaidPaidUsers}
                </p>
              </td>
            </tr>
            <tr>
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Total Revenue To Date
                </p>
              </th>
              <td style="text-align: right">
                <p
                  style="
                  padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.totalRevenueToData.amount || 0}
                </p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- Overall Platform Statistics End -->


    
    <!-- Age Distribution Start -->
    <div
      style="
        border-radius: 15px;
        border: 1px solid #c0ccf7;
        box-shadow: 0px 0px 6.9px -1px #afdaff;
        margin: 20px 0;
      "
    >
      <div style="padding: 5px 20px 0 20px">
        <p
          style="
            font-family: sans-serif;
            font-size: 20px;
            font-weight: normal;
            color: #000;
            margin-bottom: 0;
            margin-top: 5px;
            padding-left: 5px;
            padding-top: 4px;
            border-left: 3px solid #00bf71;
          "
        >
          Age Distribution
        </p>
      </div>
      <hr color="#c0ccf7" />
      <div style="padding: 20px">
        <div
          style="border: 1px solid #c0ccf7; border-radius: 10px; padding: 6px"
        >
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              border-spacing: 30px;
            "
          >
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  10-16
                </p>
              </th>
              <td>
                <p
                  style="
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.firstRangeCount}
                </p>
              </td>
              <td style="text-align: right">
                <p
                  style="
                    padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.firstRangePer}%
                </p>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                17-28
                </p>
              </th>
              <td>
                <p
                  style="
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.secondRangeCount}
                </p>
              </td>
              <td style="text-align: right">
                <p
                  style="
                    padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.secondRangePer}%
                </p>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                29-45
                </p>
              </th>
              <td>
                <p
                  style="
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.thirdRangeCount}
                </p>
              </td>
              <td style="text-align: right">
                <p
                  style="
                    padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.thirdRangePer}%
                </p>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                45-60
                </p>
              </th>
              <td>
                <p
                  style="
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.forthRangeCount}
                </p>
              </td>
              <td style="text-align: right">
                <p
                  style="
                    padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.forthRangePer}%
                </p>
              </td>
            </tr>
            <tr>
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                Other
                </p>
              </th>
              <td>
                <p
                  style="
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.fifthRangeCount}
                </p>
              </td>
              <td style="text-align: right">
                <p
                  style="
                    padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.getAgeData.fifthRangePer}%
                </p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- Age Distribution End -->


    
    <!-- Gender Distribution Start -->
    <div
      style="
        border-radius: 15px;
        border: 1px solid #c0ccf7;
        box-shadow: 0px 0px 6.9px -1px #afdaff;
        margin: 20px 0;
      "
    >
      <div style="padding: 5px 20px 0 20px">
        <p
          style="
            font-family: sans-serif;
            font-size: 20px;
            font-weight: normal;
            color: #000;
            margin-bottom: 0;
            margin-top: 5px;
            padding-left: 5px;
            padding-top: 4px;
            border-left: 3px solid #00bf71;
          "
        >
          Gender Distribution
        </p>
      </div>
      <hr color="#c0ccf7" />
      <div style="padding: 20px">
        <div
          style="border: 1px solid #c0ccf7; border-radius: 10px; padding: 6px"
        >
          <table
            style="
              width: 100%;
              border-collapse: collapse;
              border-spacing: 30px;
            "
          >
            <tr style="border-bottom: 1px solid #c0ccf7">
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Male
                </p>
              </th>
              <td>
                <p
                  style="
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.genderDistribution.maleCount || 0}
                </p>
              </td>
              <td style="text-align: right">
                <p
                  style="
                    padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.genderDistribution.malePercentage || 0}%
                </p>
              </td>
            </tr>
            <tr>
              <th style="text-align: left">
                <p
                  style="
                    padding-left: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #000;
                  "
                >
                  Female
                </p>
              </th>
              <td>
                <p
                  style="
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.genderDistribution.femaleCount || 0}
                </p>
              </td>
              <td style="text-align: right">
                <p
                  style="
                    padding-right: 10px;
                    font-family: sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #0d66b5;
                  "
                >
                ${getdata.genderDistribution.femalePercentage || 0}%
                </p>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- Gender Distribution End -->


    
    <!-- Today's User Enagement Start -->
    <div
    style="
      border-radius: 15px;
      border: 1px solid #c0ccf7;
      box-shadow: 0px 0px 6.9px -1px #afdaff;
      margin: 20px 0;
    "
  >
    <div style="padding: 5px 20px 0 20px">
      <p
        style="
          font-family: sans-serif;
          font-size: 20px;
          font-weight: normal;
          color: #000;
          margin-bottom: 0;
          margin-top: 5px;
          padding-left: 5px;
          padding-top: 4px;
          border-left: 3px solid #00bf71;
        "
      >
        Today's User Enagement:
      </p>
    </div>
    <hr color="#c0ccf7" />
    <div style="padding: 20px">
      <div
        style="border: 1px solid #c0ccf7; border-radius: 10px; padding: 6px"
      >
        <table
          style="
            width: 100%;
            border-collapse: collapse;
            border-spacing: 30px;
          "
        >
          <tr style="border-bottom: 1px solid #c0ccf7">
            <th style="text-align: left">
              <p
                style="
                  padding-left: 10px;
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #000;
                "
              >
                Paid
              </p>
            </th>
            </td>
            <td>
              <p
                style="
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #0d66b5;
                "
              >
              ${getdata.todayUserEnagement.todayGetPaymentCount || 0}
              </p>
            </td>
            <td style="text-align: right">
              <p
                style="
                  padding-right: 10px;
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #0d66b5;
                "
              >
              ${getdata.todayUserEnagement.todayGetPaymentPar || 0}%
              </p>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #c0ccf7">
            <th style="text-align: left">
              <p
                style="
                  padding-left: 10px;
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #000;
                "
              >
              Unpaid
              </p>
            </th>
            <td>
              <p
                style="
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #0d66b5;
                "
              >
              ${getdata.todayUserEnagement.todayFaildPaymentCount || 0}
              </p>
            </td>
            <td style="text-align: right">
              <p
                style="
                  padding-right: 10px;
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #0d66b5;
                "
              >
              ${getdata.todayUserEnagement.todayFaildPaymentPar  || 0}%
              </p>
            </td>
          </tr>
          <tr>
            <th style="text-align: left">
              <p
                style="
                  padding-left: 10px;
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #000;
                "
              >
              Other
              </p>
            </th>
            <td>
              <p
                style="
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #0d66b5;
                "
              >
              10
              </p>
            </td>
            <td style="text-align: right">
              <p
                style="
                  padding-right: 10px;
                  font-family: sans-serif;
                  font-size: 15px;
                  font-weight: 600;
                  color: #0d66b5;
                "
              >
                45%
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
  <!-- Today's User Enagement End -->



      <!-- State & City Wise Distribution Start -->
      <div style="border-radius: 15px; border: 1px solid #c0ccf7; box-shadow: 0px 0px 6.9px -1px #afdaff; margin: 20px 0;">
        <div style="padding: 5px 20px 0 20px">
          <p style="font-family: sans-serif; font-size: 20px; font-weight: normal; color: #000; margin-bottom: 0; margin-top: 5px; padding-left: 5px; padding-top: 4px; border-left: 3px solid #00bf71;">
            State & City Wise Distribution:
          </p>
        </div>
        <hr color="#c0ccf7" />
        <div style="padding: 20px">
          <div style="border: 1px solid #c0ccf7; border-radius: 10px">
            <table style="width: 100%; border-collapse: collapse; border-spacing: 30px;">
              <tr style="border-bottom: 1px solid #c0ccf7; background-color: #edf6ff;">
                <th style="text-align: left; border-top-left-radius: 9px">
                  <p style="padding-left: 10px; font-family: sans-serif; font-size: 15px; font-weight: 600; color: #000; text-align: left;">
                    State
                  </p>
                </th>
                <th style="text-align: left">
                  <p style="font-family: sans-serif; font-size: 15px; font-weight: 600; color: #000; padding-left: 17px;">
                    City
                  </p>
                </th>
                <th style="text-align: right; border-top-right-radius: 9px">
                  <p style="padding-right: 10px; font-family: sans-serif; font-size: 15px; font-weight: 600; color: #000;">
                    Number
                  </p>
                </th>
              </tr>
              ${generateRowsHTML(stateAndCityToday)}
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  return tableHtml;
};

function generateRowsHTML(data) {
  let rowsHtml = '';
  for (const state in data) {
    rowsHtml += `<tr style="border-bottom: 1px solid #c0ccf7">
      <td style="text-align: left; border-right: 1px solid #c0ccf7" rowspan="${data[state].length + 1}">
        <p style="padding-left: 10px; font-family: sans-serif; font-size: 15px; font-weight: 600; color: #000; text-align: left;">
          ${state}
        </p>
      </td>
    </tr>`;

    for (let i = 0; i < data[state].length; i++) {
      rowsHtml += `<tr style="border-bottom: 1px solid #c0ccf7">
        <td>
          <p style="text-align: left; font-family: sans-serif; font-size: 15px; font-weight: 600; color: #000; padding-left: 15px;">
            ${data[state][i].city}
          </p>
        </td>
        <td style="text-align: right">
          <p style="padding-right: 10px; font-family: sans-serif; font-size: 15px; font-weight: 600; color: #0d66b5;">
            ${data[state][i].count}
          </p>
        </td>
      </tr>`;
    }
  }
  return rowsHtml;
}


