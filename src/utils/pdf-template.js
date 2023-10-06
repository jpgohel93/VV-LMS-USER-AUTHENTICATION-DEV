const constants = require('./constant');
const { awsSignedUrl } = require('./aws');

module.exports.invoiceTemplate = async (data) => {
    let shape;
    if(data.status == 'paid' || data.status == 'Success'){
        shape = await awsSignedUrl(constants.INVOICE_STATUS_PAID);
    }else if(data.status == 'failed' || data.status == "Failure"){
        shape = await awsSignedUrl(constants.INVOICE_STATUS_FAILED);
    }else if(data.status == 'refunded'){
        shape = await awsSignedUrl(constants.INVOICE_STATUS_REFUNDED);
    }else if(data.status == 'unpaid'){
        shape = await awsSignedUrl(constants.INVOICE_STATUS_UNPAID);
    }

    // let courseList = ``
    // if(data?.course?.length > 0){
    //     await Promise.all(
    //         data.course.map(element => {
    //             courseList = courseList +   `<tr>
    //                 <td style="font-weight: 500;padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: left;">`+element.course_title+`</td>
    //                 <td style="font-weight: 600;padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: right;">`+element.amount+`</td>
    //             </tr>  `;       
    //         })
    //     )
        
    // }

    return await `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Paid Invoice</title>
        <link defer="defer" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Poppins:ital,wght@0,100;1,100&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0;padding: 0;font-family: Montserrat;">
        <div class="containerposition">
            <div class="logo-background" style="width: 100%;height: 100%;z-index: -9999;"></div>
            <div class="section1 container" style="margin: 1.5%;">
                <div class="logo"><img src="`+ await awsSignedUrl(constants.EMAIL_TEMPLATE_LOGO_URL) + `" alt="" srcset=""></div>
                <div class="svg" style="text-align: right;">
                    <div class="paid-shape" style="margin: -92px -10px;"><img src="`+shape+`" alt="" srcset=""></div>
                </div>
            </div>
            <div class="section2 container" style="margin: 33px;">
                <div class="address-left" style="width: 33%;display: inline-block;">
                    <p class="address" style="font-weight: 500;max-width: 300px;margin: 38px -8px 0px -2px">`+constants.EMAIL_TEMPLATE_ADDRESS+`</p>
                </div>
                <div class="address-right" style="text-align: right;display: inline-block;width: 33%;float: right;margin-top: 30px;">
                    <h1 style="margin: 0;">Invoice</h1>
                    <h2 style="margin: 0;">#102394
                </h2></div>
            </div>
            <div class="section3" style="margin-top: 30px;margin-bottom: 30px;">
                <div class="section3-left" style="background-color: #6b63ff42;padding-left: 33px;padding-top: 10px;display: inline-block;width: 33%;">
                    <h4 style="margin-top: 0;">Invoice To :</h4>
                    <p class="address" style="font-weight: 600;max-width: 300px;">`+data.username+`</p>
                </div>
                <div class="section3-right" style="margin-right: 33px;display: inline-block;width: 33%;float: right;margin-top: 1.5%;">
                    <table class="table-small" style="width: 100%;border-collapse: collapse;">
                        <tr>
                            <th style="padding: 5px 35px 0 0;text-align: left;">Issue Date</th>
                            <td style="font-weight: 600;text-align: right;padding: 5px 0 0 35px;">`+data.issue_data+`</td>
                        </tr>
                        <tr>
                            <th style="padding: 5px 35px 0 0;text-align: left;">Due Date</th>
                            <td style="font-weight: 600;text-align: right;padding: 5px 0 0 35px;">`+data.due_date+`</td>
                        </tr>
                        <tr>
                            <th style="padding: 5px 35px 0 0;text-align: left;">Amount Due</th>
                            <td style="font-weight: 600;text-align: right;padding: 5px 0 0 35px;">`+data.amount+`</td>
                        </tr>
                    </table>
                </div>
            </div>
            <hr style="border: 1px solid #c9c9c9;">
            <div class="section4 container" style="margin: 33px;">
                <table class="item-list" style="width: 100%;border-collapse: collapse;">
                    <tr>
                        <th style="padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: left;">Course name</th>
                        <th style="padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: right;">Price</th>
                        <th style="padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: right;">Discount</th>
                        <th style="padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: right;">Total</th>
                    </tr>
                    <tr>
                        <td style="font-weight: 500;padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: left;">`+data.course_title+`</td>
                        <td style="font-weight: 600;padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: right;">`+data.course_base_price+`</td>
                        <td style="font-weight: 600;padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: right;">`+data.discount+`</td>
                        <td style="font-weight: 600;padding: 10px 0;border-bottom: 1px solid #c9c9c9;text-align: right;">`+data.discount_amount+`</td>
                    </tr>    
                </table>
                <table class="subtotal-table" style="border-collapse: collapse;margin-left: auto;margin-right: 0;">
                    <tr style="border-bottom: 1px solid #c9c9c9;">
                        <th style="padding: 15px 35px 15px 0;text-align: left;">Sub Total</th>
                        <td style="font-weight: 600;padding: 15px 0 15px 35px;text-align: right;">`+data.discount_amount+`</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #c9c9c9;">
                        <th style="padding: 15px 35px 15px 0;text-align: left;">Coupon Amount</th>
                        <td style="font-weight: 600;padding: 15px 0 15px 35px;text-align: right;">`+data.coupon_amount+`</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #c9c9c9;">
                        <th style="padding: 15px 35px 15px 0;text-align: left;">Referral Discount</th>
                        <td style="font-weight: 600;padding: 15px 0 15px 35px;text-align: right;">`+data.heman_discount_amount+`</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #c9c9c9;">
                        <th style="padding: 15px 35px 15px 0;text-align: left;">GST(`+data.tax_percentage+`%)</th>
                        <td style="font-weight: 600;padding: 15px 0 15px 35px;text-align: right;">`+data.tax_amount+`</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #c9c9c9;">
                        <th style="padding: 15px 35px 15px 0;text-align: left;">Convenience Fees(`+data.convince_fee+`%)</th>
                        <td style="font-weight: 600;padding: 15px 0 15px 35px;text-align: right;">`+data.convince_fee_amount+`</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #c9c9c9;">
                        <th style="padding: 15px 35px 15px 0;text-align: left;">Grand Total</th>
                        <td style="font-weight: 600;padding: 15px 0 15px 35px;text-align: right;">`+data.amount+`</td>
                    </tr>
                </table>
            </div>
            <div class="section5 container" style="margin: 33px;margin-top: 40px;">
                <p style="font-weight:600">Invoice Generated on 01/12/2022</p>
                <p style="font-weight:600">GST/HST Registration #711674515</p>
            </div>
            <hr style="border: 1px solid #c9c9c9;">
            <div class="section6 container" style="margin: 33px;">
                <h4>Contact us</h4>
                <p class="section6-para" style="font-weight: 600;max-width: 310px;">If you have gone through your bill and still have question
                </p>
                <div class="section6-sub" style="">
                    <p style="font-weight:600">Call : `+constants.EMAIL_TEMPLATE_MOBILE_NO+`</p>
                    <p style="font-weight:600">Email : `+constants.EMAIL_TEMPLATE_MAIL_ID+`</p>
                </div>
            </div>
        </div>
    </body>
    
    </html>`;

};