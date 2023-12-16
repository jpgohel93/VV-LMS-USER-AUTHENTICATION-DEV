const constants = require('./constant');

module.exports.invoiceTemplate = async (data) => {
    let shape;
    if(data.status == 'paid' || data.status == 'Success'){
        shape = constants.INVOICE_STATUS_PAID;
    }else if(data.status == 'failed' || data.status == "Failure"){
        shape = constants.INVOICE_STATUS_FAILED;
    }else if(data.status == 'refunded'){
        shape = constants.INVOICE_STATUS_REFUNDED;
    }else if(data.status == 'unpaid'){
        shape = constants.INVOICE_STATUS_UNPAID;
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
            <div class="section1 container" style="margin: 1.5%;display: flex;">
                <div class="logo"><img  style="width: 20%;height: 80%;" src="`+ constants.EMAIL_TEMPLATE_LOGO_URL+ `" alt="" srcset=""></div>
            </div>
            <div class="section2 container">
                <div class="address-left" style="width: 33%;display: inline-block;">
                    <p class="address" style="font-weight: 500;max-width: 300px;">`+constants.EMAIL_TEMPLATE_ADDRESS+`</p>
                </div>
                <div class="address-right" style="text-align: right;display: inline-block;width: 33%;float: right;margin-top: 30px;">
                    <h1 style="margin: 0;">Invoice</h1>
                    <h2 style="margin: 0;">#`+data.invoice_id+`
                </h2></div>
            </div>
            <div class="section3" style="margin-top: 30px;margin-bottom: 30px;">
                <div class="section3-left" style="background-color: #6b63ff42;padding-left: 33px;padding-top: 10px;display: inline-block;width: 33%; ">
                    <h4 style="margin-top: 0;">Invoice To :</h4>
                    <p class="address" style="font-weight: 600;max-width: 300px;">`+ data.username+`</p>
                </div>
                <div class="section3-right" style="margin-right: 33px;display: inline-block;width: 35%;float: right;margin-top: 1.5%;">
                    <table class="table-small" style="width: 100%;border-collapse: collapse;">
                        <tr>
                            <th style="padding: 5px 35px 0 0;text-align: left;">Issue Date</th>
                            <td style="font-weight: 600;text-align: right;padding: 5px 0 0 0px;">`+data.issue_data+`</td>
                        </tr>
                        <tr>
                            <th style="padding: 5px 35px 0 0;text-align: left;">Due Date</th>
                            <td style="font-weight: 600;text-align: right;padding: 5px 0 0 0px;">`+data.due_date+`</td>
                        </tr>
                        <tr>
                            <th style="padding: 5px 35px 0 0;text-align: left;">Amount Due</th>
                            <td style="font-weight: 600;text-align: right;padding: 5px 0 0 0px;">`+data.amount+`</td>
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

    // return await `
    //     <html>
    //     <body>
    //         <div
    //         style='
    //         padding: 0.625rem;
    //         width: 26.5625rem;
    //         margin: 0;
    //         position: relative;
    //         overflow: hidden;
    //         '
    //     >
    //         <div
    //         style='
    //             width: 100%;
    //             position: relative;
    //             padding: 0.5rem 0;
    //             border: 0.0625rem solid #000;
    //             border-bottom: 0;
    //             height: 5.5rem;
    //             background-color: #fff;
    //         '
    //         >
    //         <img src='${constants.INVOICE_HEADER_IMAGE}' style='width: 100%; height: auto;' />
    //         </div>
    //         <div
    //         style='
    //             border: 0.0625rem solid #000;
    //             border-collapse: collapse;
    //             width: 100%;
    //             background-color: #fff;
    //         '
    //         >
    //         <div style=' vertical-align: baseline; '>
    //             <div>
    //             <div style='text-align: center; position: relative; '>
    //                 <p style='color: #2E295D; font-size: 0.625rem; font-weight: 600; margin: 0 '>INVOICE</p>
    //                 <div style=' position: absolute; top: 20%; right: 0; margin-right: 0.3125rem '>
    //                 <p style=' color: #000; font-size: 6px; font-weight: 600; margin: 0 '>ORIGINAL FOR RECIPIENT</p>
    //                 </div>
    //             </div>
    //             </div>
    //             <div style='display: flex; border-top: 0.0625rem solid #000 '>
    //             <div style='flex: 1; border-right: 0.0625rem solid #000 '>
    //                 <div
    //                 style='
    //                     border-bottom: 0.0625rem solid #000;
    //                     text-align: center;
    //                     flex: 1;
    //                 '
    //                 >
    //                 <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem '>Customer Detail</p>
    //                 </div>
    //                 <div style='display: flex; margin-left: 0.3125rem;'>
    //                 <div style='text-align: left; width: 50%;'>
    //                     <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Customer Name:</p>
    //                 </div>
    //                 <div style='text-align: left;'>
    //                     <p style='color: #000; margin: 0; font-size: 0.5rem;'>${ data?.username || "N/A" }</p>
    //                 </div>
    //                 </div>
    //                 <div style='display: flex; margin-left: 0.3125rem;'>
    //                 <div style='text-align: left; width: 50%;'>
    //                     <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Phone:</p>
    //                 </div>
    //                 <div style='text-align: left; width: 50%;'>
    //                     <p style='color: #000; margin: 0; font-size: 0.5rem;'>${ data?.mobile_no || "N/A" }</p>
    //                 </div>
    //                 </div>
    //             </div>
    //             <div style='flex: 1;'>
    //                 <div style='display: flex;'>
    //                 <div style='text-align: left; width: 38%; margin-left: 0.3125rem;'>
    //                     <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Invoice No:</p>
    //                 </div>
    //                 <div style=' text-align: left;'>
    //                     <p style=' color: #000; margin: 0; font-size: 0.5rem;'>
    //                         ${data.invoice_id}
    //                     </p>
    //                 </div>
    //                 </div>
    //                 <div style='display: flex;'>
    //                 <div style='text-align: left; width: 38%; margin-left: 0.3125rem;'>
    //                     <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Invoice Date:</p>
    //                 </div>
    //                 <div style='text-align: left;'>
    //                     <p style='color: #000; margin: 0; font-size: 0.5rem;'>${data.issue_data}</p>
    //                 </div>
    //                 </div>
    //                 <div style='padding: 20px 0;'></div>
    //             </div>
    //             </div>
    //         </div>
    //         </div>
    //         <div
    //         style='
    //             border: 0.0625rem solid #000;
    //             border-collapse: collapse;
    //             width: 100%;
    //             border-top: none;
    //             background-color: #fff;
    //         '
    //         >
    //         <div style=' vertical-align: baseline;'>
    //             <div style=' display: flex;'>
    //             <div
    //                 style='
    //                 border-right: 0.0625rem solid #000;
    //                 border-top: none;
    //                 text-align: center;
    //                 padding: 0.3125rem 0.625rem;
    //                 flex: 0.3;
    //                 '
    //             >
    //                 <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>HSN</p>
    //             </div>
    //             <div
    //                 style='
    //                 border-right: 0.0625rem solid #000;
    //                 text-align: center;
    //                 padding: 0.3125rem 0.625rem;
    //                 border-bottom: none;
    //                 flex: 1;
    //                 '
    //             >
    //                 <p style=' color:#000; font-weight: bold; margin: 0; font-size: 0.5rem;' >Course Name</p>
    //             </div>
    //             <div
    //                 style='
    //                 border-right: 0.0625rem solid #000;
    //                 text-align: center;
    //                 padding: 0.3125rem 0.625rem;
    //                 border-bottom: none;
    //                 flex: 1;
    //                 '
    //             >
    //                 <p style=' color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Perticulers</p>
    //             </div>
    //             <div
    //                 style='
    //                 text-align: center;
    //                 padding: 0.3125rem 0.5625rem 0.3125rem 0.625rem;
    //                 border-right: none;
    //                 flex: 0.5;
    //                 '
    //             >
    //                 <p style=' color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Total</p>
    //             </div>
    //             </div>
    //             <div style='display: flex;'>
    //             <div
    //                 style='
    //                 border: 0.0625rem solid #000;                
    //                 border-collapse: collapse;
    //                 border-left: none;
    //                 flex: 0.5;
    //                 padding: 0 0.75rem 0.3125rem 0.8rem;
    //                 '
    //             >
    //                 <p style=' color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>999294</p>
    //             </div>
    //             <div
    //                 style='
    //                 border: 0.0625rem solid #000;
    //                 border-collapse: collapse;
    //                 border-left: none;
    //                 flex: 1 1 18.5%;
    //                 '
    //             >
    //                 <p style=' color: #000; font-weight: bold; margin: 0; font-size: 0.5rem; padding-left: 0.625rem;'>
    //                 ${ data?.course_title || "N/A" }
    //                 </p>
    //             </div>
    //             <div
    //                 style='
    //                 border: 0.0625rem solid #000;
    //                 border-collapse: collapse;
    //                 border-left: none;
    //                 padding-left: 0.875rem;
    //                 width: 8rem;
    //                 flex: 2;
    //                 '
    //             >
    //                 <div style='width: 7.5rem;'>
    //                 <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Price</p>
    //                 </div>
    //                 <div style='width: 7.5rem;'>
    //                 <p style='color: #000; font-weight: bold; margin: 0;font-size: 0.5rem;'>
    //                     Discount (${ data?.discount || 0 }%)
    //                 </p>
    //                 </div>
    //                 <div style='width: 7.5rem;'>
    //                 <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Sub Total</p>
    //                 </div>
    //                 <div style='width: 7.5rem;'>
    //                     <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>Coupon Amount</p>
    //                 </div>
                
    //                     <div style='width: 7.5rem;'>
    //                     <p style='color: #000; font-weight: bold;  margin: 0; font-size: 0.5rem;'>
    //                         Referral Discount
    //                     </p>
    //                     </div>
                    
    //                 <div style='width: 7.5rem;'>
    //                 <p style='color: #000; font-weight: bold;  margin: 0; font-size: 0.5rem;'>
    //                     GST (${ data?.tax_percentage || 0 }%)
    //                 </p>
    //                 </div>
    //                 <div style='width: 7.5rem;'>
    //                 <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem; '>
    //                     Convenience Fees (${ data?.convince_fee || 0 }%)
    //                 </p>
    //                 </div>
    //                 <div style='width: 7.5rem;'>
    //                 <p style='color: #000; font-weight: bold; margin: 0; font-size:0.5rem;'>Grand Total</p>
    //                 </div>
    //                 <div style='height: 100px;'></div>
    //             </div>
    //             <div
    //                 style='
    //                 border: 0.0625rem solid #000;
    //                 border-collapse: collapse;
    //                 border-left: none;
    //                 border-right: none;
    //                 padding: 0 0 0 1rem;
    //                 text-align: center;
    //                 flex: 1;
    //                 '
    //             >
    //                 <div>
    //                 <p style='color: #000; font-weight:bold; margin: 0; font-size: 8px; width: max-content;'>${ data?.course_base_price || 0 }/-</p>
    //                 </div>
    //                 <div>
    //                 <p style='color: #000; font-weight: bold; margin: 0; font-size: 8px; width: max-content;'>
    //                 ${ data?.discount_amount || 0 }/-
    //                 </p>
    //                 </div>
    //                 <div>
    //                 <p style=' color:#000; font-weight:bold; margin: 0; font-size:8px; width:max-content;'>${ data?.discount_amount || 0 }/-</p>
    //                 </div>
                    
    //                 <div>
    //                     <p
    //                     style=' color: #000; font-weight: bold; margin:0; font-size:8px; width: max-content; '
    //                     >${ data?.coupon_amount || 0 }/-</p>
    //                 </div>
                    
    //                     <div>
    //                     <p style='color: #000; font-weight: bold; margin: 0; font-size: 8px; width: max-content;'>
    //                     ${ data?.heman_discount_amount || 0 }/-
    //                     </p>
    //                     </div>
                    
    //                 <div>
    //                 <p style='color: #000; font-weight:bold; margin:0; font-size:8px; width:max-content;'>${ data?.tax_amount || 0 }/-</p>
    //                 </div>
    //                 <div>
    //                 <p style='color:#000; font-weight:bold; margin: 0; font-size: 8px; width:max-content;'>${ data?.convince_fee_amount || 0 }/-</p>
    //                 </div>
    //                 <div>
    //                 <p style='color:#000; font-weight:bold; margin: 0; font-size: 8px; width: max-content;'>${ data?.amount || 0 }/-</p>
    //                 </div>
    //             </div>
    //             </div>
    //             <div style='display:flex;'>
    //             <div style='text-align:center; flex: 4; '>
    //                 <p style='color: #000; font-weight:bold; margin: 0; font-size: 0.5rem;'>Total in words</p>
    //             </div>
    //             </div>
    //             <div style='display: flex;'>
    //             <div
    //                 style='
    //                 border: 0.0625rem solid #000;
    //                 border-collapse: collapse;
    //                 text-align: center;
    //                 border-left: none;
    //                 border-right: none;
    //                 flex: 4;
    //                 padding: 0.3125rem 0;
    //                 '
    //             >
    //             ${ data?.amount ? await numberToWords(data?.amount) : "Zero"}
    //             </div>
    //             </div>
    //             <div style='display: flex;'>
    //             <div style='text-align: center; flex: 2;'>
    //                 <p
    //                 style='
    //                     color: #000;
    //                     font-weight: bold;
    //                     margin: 0;
    //                     font-size: 0.5rem;
    //                     border-bottom: 0.0625rem solid #000;
    //                 '
    //                 >
    //                 Bank Details
    //                 </p>
    //             </div>
    //             <div style='border-left: 0.0625rem solid #000; text-align:center; flex:2;'>
    //                 <p
    //                 style='
    //                     color: #000;
    //                     font-weight: bold;
    //                     margin: 0;
    //                     font-size: 0.5rem;
    //                     border-bottom: 0.0625rem solid #000;
    //                 '
    //                 >
    //                 Terms and Conditions
    //                 </p>
    //             </div>
    //             </div>
    //             <div style='display: flex;'>
    //             <div style='flex:2; border-right:0.0625rem solid #000; padding:0.3125rem 0;'>
    //                 <div style='display: flex; justify-content: flex-start; padding-left: 0.875rem;'>
    //                 <div style='text-align: left; width: 50%; margin-right: 0.875rem;'>
    //                     <p style='color: #000; font-weight:bold; margin: 0; font-size: 0.5rem;'>Bank Name</p>
    //                 </div>
    //                 <div style='text-align: left; width: fit-content;'>
    //                     <p style='color:#000; margin: 0; font-size:0.5rem;'>ICICI Bank</p>
    //                 </div>
    //                 </div>
    //                 <div style='display: flex; justify-content: flex-start; padding-left:0.875rem;'>
    //                 <div style='text-align: left; width: 50%; margin-right: 0.875rem;'>
    //                     <p style='color: #000; font-weight:bold; margin: 0; font-size:0.5rem;'>Branch Name</p>
    //                 </div>
    //                 <div style='text-align: left; width: fit-content;'>
    //                     <p style='color:#000; margin: 0; font-size:0.5rem;'>Kalawad Road</p>
    //                 </div>
    //                 </div>
    //                 <div style='display: flex; justify-content: flex-start; padding-left: 0.875rem;'>
    //                 <div style='text-align: left; width: 50%; margin-right: 0.875rem;'>
    //                     <p style='color: #000; font-weight: bold; margin: 0; font-size: 0.5rem;'>
    //                     Bank Account Number
    //                     </p>
    //                 </div>
    //                 <div style='text-align: left; width:fit-content;'>
    //                     <p style='color: #000; margin: 0; font-size: 0.5rem;'>624805017419</p>
    //                 </div>
    //                 </div>
    //                 <div style='display: flex; justify-content:flex-start; padding-left: 0.875rem;'>
    //                 <div style='text-align: left; width:50%; margin-right: 0.875rem;'>
    //                     <p style='color:#000; font-weight:bold; margin: 0; font-size:0.5rem;'>Bank Branch IFSC</p>
    //                 </div>
    //                 <div style='text-align:left; width:fit-content;'>
    //                     <p style='color: #000; margin: 0; font-size: 0.5rem;'>ICIC0006248</p>
    //                 </div>
    //                 </div>
    //             </div>
    //             <div
    //                 style='
    //                 text-align: center;
    //                 vertical-align: middle;
    //                 flex: 2;
    //                 display: flex;
    //                 justify-content: center;
    //                 align-items: center;
    //                 '
    //             >
    //                 <p style='color: #000; margin: 0; font-size:0.5rem;'>1. Subject to Rajkot Jurisdiction.</p>
    //             </div>
    //             </div>
    //         </div>
    //         </div>
    //         <div
    //         style='
    //             border: 0.0625rem solid #000;
    //             border-collapse: collapse;
    //             width: 100%;
    //             border-top: none;
    //             background-color: #fff;
    //         '
    //         >
    //         <div style='vertical-align: middle; border-top:none;'>
    //             <div style='border-top: none; display: flex;'>
    //             <div
    //                 style='
    //                 border-right: 0.0625rem solid #000;
    //                 text-align: center;
    //                 border-top: none;
    //                 flex: 2;
    //                 display: flex;
    //                 justify-content:center;
    //                 align-items: center;
    //                 '
    //             >
    //                 <p style='color: #000; margin: 0; font-size: 0.5rem;'>
    //                 <p style='color: #000; margin: 0; font-size:0.375rem;'>
    //                     Certified that the particulars given above are true and correct
    //                 </p>
    //                 <p style='color: #000; margin: 0; font-size: 0.4375rem;'>For Virtual Afsar</p>
    //                 </p>
    //             </div>
    //             <div style='text-align:center; width:13.3125rem; border-top:none; flex:2;'>
    //                 <img
    //                 src='${constants.INVOICE_FOOTER_IMAGE}'
    //                 alt=''
    //                 style='width: 60%; height: auto; padding:0.3125rem 0;'
    //                 />
    //                 <div
    //                 style='border-top: 0.0625rem solid #000; text-align: center; flex: 2; padding:0.1875rem 0;'
    //                 >
    //                 <p style='    color:#000; margin: 0; font-size: 0.5rem;'>Authorised Signatory</p>
    //                 </div>
    //             </div>
    //             </div>
    //         </div>
    //         </div>
    //     </div>
    //     </body>
    // </html>
    // `
};

function numberToWords(num) {
    const units = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    function convertLessThanOneThousand(number) {
        const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        if (number < 20) {
            return words[number];
        } else {
            return words[Math.floor(number / 10)] + ' ' + words[number % 10];
        }
    }

    function convert(number, index) {
        if (number === 0) return '';
        if (number < 1000) {
            return convertLessThanOneThousand(number) + ' ' + units[index];
        } else {
            return convert(Math.floor(number / 1000), index + 1) + ' ' + convertLessThanOneThousand(number % 1000) + ' ' + units[index];
        }
    }

    if (num === 0) {
        return 'Zero';
    } else {
        return convert(num, 0) + ' Only';
    }
}