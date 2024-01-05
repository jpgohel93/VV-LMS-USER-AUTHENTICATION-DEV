const constants = require('./constant');

module.exports.invoiceTemplate = async (data) => {

      return await `
      <html>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>
          p {
            font-family: "Josefin Sans", sans-serif;
          }
        </style>
      </head>
      <body>
        <div
          style="width: 37.3rem; margin: 0; position: relative; margin-top: 50px"
        >
          <div
            style="
              height: 30rem;
              background-color: #0e5f9f;
              padding-top: 1rem;
              padding-bottom: 1rem;
              padding-right: 1rem;
              width: 10rem;
              position: absolute;
              top: 4rem;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              margin-top: 25px;
              margin-left: -18px;
            "
          >
            <div style="width: 100%">
              <div style="text-align: right">
                <p
                  style="
                    font-size: 9pt;
                    font-weight: 900;
                    color: #c3e7f5;
                    margin: 0;
                  "
                >
                  INVOICE NO:
                </p>
                <p
                  style="
                    font-size: 12pt;
                    font-weight: 300;
                    color: #fff;
                    margin: 0;
                    padding-top: 4px;
                  "
                >
                  ${data.invoice_id}
                </p>
              </div>
              <div style="text-align: right; margin-top: 1rem">
                <p
                  style="
                    font-size: 9pt;
                    font-weight: bold;
                    color: #c3e7f5;
                    margin: 0;
                  "
                >
                  INVOICE DATE:
                </p>
                <p
                  style="
                    font-size: 12pt;
                    font-weight: 300;
                    color: #fff;
                    margin: 0;
                    padding-top: 4px;
                  "
                >
                  ${data.issue_data}
                </p>
              </div>
              <div style="text-align: right; margin-top: 1rem">
                <p
                  style="
                    font-size: 9pt;
                    font-weight: bold;
                    color: #c3e7f5;
                    margin: 0;
                  "
                >
                  ISSUED TO:
                </p>
                <p
                  style="
                    font-size: 13pt;
                    font-weight: bold;
                    color: #fff;
                    margin: 0;
                    padding-top: 4px;
                  "
                >
                  ${ data?.username || "" }
                </p>
                <p
                  style="
                    font-size: 12pt;
                    font-weight: 300;
                    color: #fff;
                    margin: 0;
                    padding-top: 5px;
                  "
                >
                  ${ data?.mobile_no || "" }
                </p>
                <p
                  style="
                    font-size: 12pt;
                    font-weight: 300;
                    color: #fff;
                    margin: 0;
                    padding-top: 5px;
                  "
                >
                  ${ data?.email || "" }
                </p>
              </div>
            </div>
            <div
              style="
                background-color: #c3e7f5;
                border-radius: 50%;
                width: 5rem;
                height: 5rem;
                margin-top: 10rem;
                margin-bottom: 2rem;
                margin-left: 2rem;
                margin-right: auto;
                padding: 0.8rem;
                text-align: center;
              "
            >
              <img
                src="${ constants.INVOICE_VICON_IMAGE }"
                style="width: 4rem; height: 5rem"
              />
            </div>
          </div>
          <div
            style="
              padding-top: 1rem;
              width: 34.2rem;
              margin-left: 50px;
              background-color: #c3e7f5;
            "
          >
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 2rem 0 25px;
              "
            >
              <table style="width: 100%">
                <tbody style="width: 100%">
                  <tr>
                    <td style="vertical-align: top">
                      <p
                        style="
                          font-size: 1.8rem;
                          font-weight: 900;
                          color: #123e6f;
                          margin: 0;
                          padding-top: 8px;
                        "
                      >
                        I N V O I C E
                      </p>
                    </td>
                    <td style="text-align: end">
                      
                    
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
    
            <div style="width: 27.5rem; margin-left: auto; overflow: hidden">
              <table style="width: 100%; margin-bottom: 1rem; margin-top: 1rem">
                <tbody style="width: 100%">
                  <tr>
                    <td style="vertical-align: top; padding: 0; width: 50%">
                      <table style="width: 100%; padding-left: 5px">
                        <tbody style="width: 100%">
                          <tr>
                            <td style="vertical-align: top">
                             
                            </td>
                            <td>
                              <p
                                style="
                                  color: #123e6f;
                                  font-weight: 400;
                                  margin: 0;
                                  font-size: 11px;
                                  text-align: left;
                                "
                              >
                                ${ constants.EMAIL_TEMPLATE_ADDRESS }
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style="padding: 0; width: 40%">
                      <p
                        style="
                          color: #123e6f;
                          font-weight: 400;
                          margin: 0;
                          font-size: 11px;
                          text-align: left;
                        "
                      >
                        <span style="vertical-align: middle">
                          <img
                            src="${ constants.INVOICE_PHONE_IMAGE }"
                            style="
                              width: 6px;
                              height: 6px;
                              background-color: #123e6f;
                              border-radius: 50%;
                              padding: 2px;
                              margin-right: 0.3rem;
                            "
                          />
                        </span>
                        Tel : ${ constants.EMAIL_TEMPLATE_MOBILE_NO }
                      </p>
                      <p style="margin: 5px 0">
                        <a
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0;
                            font-size: 11px;
                            text-align: left;
                            text-decoration: none;
                          "
                          href="https://virtualafsar.com"
                        >
                          <span>
                            <img
                              src="${ constants.INVOICE_WEB_IMAGE }"
                              style="
                                width: 6px;
                                height: 6px;
                                background-color: #123e6f;
                                border-radius: 50%;
                                padding: 2px;
                                margin-right: 0.3rem;
                              "
                            />
                          </span>
                          Web : https://virtualafsar.com
                        </a>
                      </p>
                      <p style="margin: 0">
                        <a
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0;
                            font-size: 11px;
                            text-align: left;
                            text-decoration: none;
                          "
                          href="mailto:${ constants.EMAIL_TEMPLATE_MAIL_ID }"
                        >
                          <span>
                            <img
                              src="${ constants.INVOICE_MAIL_IMAGE }"
                              style="
                                width: 6px;
                                height: 6px;
                                background-color: #123e6f;
                                border-radius: 50%;
                                padding: 2px;
                                margin-right: 0.3rem;
                              "
                            />
                          </span>
                          Email : ${ constants.EMAIL_TEMPLATE_MAIL_ID }
                        </a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style="width: 100%; border-collapse: collapse">
                <tbody style="width: 100%">
                  <tr style="width: 100%">
                    <td
                      style="
                        border-right: 0.0625rem solid #0e5f9f;
                        border-top: 0.0625rem solid #0e5f9f;
                        text-align: center;
                        padding: 0.3125rem 0.625rem;
                        border-bottom: none;
                      "
                    >
                      <p
                        style="
                          color: #123e6f;
                          font-weight: 900;
                          margin: 0;
                          font-size: 11px;
                        "
                      >
                        COURSE NAME
                      </p>
                    </td>
    
                    <td
                      style="
                        border-right: 0.0625rem solid #0e5f9f;
                        border-top: 0.0625rem solid #0e5f9f;
                        text-align: center;
                        padding: 0.3125rem 0.625rem;
                        border-bottom: none;
                      "
                    >
                      <p
                        style="
                          color: #123e6f;
                          font-weight: 900;
                          margin: 0;
                          font-size: 11px;
                        "
                      >
                        PARTICULARS
                      </p>
                    </td>
    
                    <td
                      style="
                        text-align: center;
                        padding: 0.3125rem 0.5625rem 0.3125rem 0.625rem;
                        border-right: none;
                        border-top: 0.0625rem solid #0e5f9f;
                      "
                    >
                      <p
                        style="
                          color: #123e6f;
                          font-weight: 900;
                          margin: 0;
                          font-size: 11px;
                        "
                      >
                        AMOUNT
                      </p>
                    </td>
                  </tr>
    
                  <tr style="width: 100%">
                    <td
                      style="
                        border: 0.0625rem solid #0e5f9f;
                        padding: 0.3125rem 0.625rem;
                        border-left: none;
                        vertical-align: top;
                        border-bottom: none;
                      "
                    >
                      <p
                        style="
                          color: #123e6f;
                          font-weight: 400;
                          margin: 0;
                          font-size: 11pt;
                          padding-top: 2;
                          text-align: center;
                        "
                      >
                        ${ data?.course_title || "" }
                      </p>
                    </td>
    
                    <td
                      style="
                        border: 0.0625rem solid #0e5f9f;
                        border-left: none;
                        padding: 0.3125rem 0.625rem;
                        vertical-align: top;
                        border-bottom: none;
                      "
                    >
                      <div>
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 800;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          Price
                        </p>
                      </div>
    
                      <div>
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 800;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          Discount (${ data?.discount || 0 }%)
                        </p>
                      </div>
    
                      <div>
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 800;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          Sub Total
                        </p>
                      </div>
    
                      <div>
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 800;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          Coupon Amount
                        </p>
                      </div>
    
                      <div>
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 800;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          Referral Discount
                        </p>
                      </div>
    
                      <div>
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 800;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          GST (${ data?.tax_percentage || 0 }%)
                        </p>
                      </div>
    
                      <div>
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 800;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          Convenience Fees (${ data?.convince_fee || 0 }%)
                        </p>
                      </div>
                    </td>
    
                    <td
                      style="
                        border: 0.0625rem solid #0e5f9f;
                        border-bottom: none;
                        padding: 0.3125rem 0.625rem;
                        text-align: center;
                        border-left: none;
                        border-right: none;
                        vertical-align: top;
                      "
                    >
                      <div style="width: 5rem">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0 auto;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          ${ data?.course_base_price || 0 }/-
                        </p>
                      </div>
    
                      <div style="width: 5rem">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0 auto;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          ${ data?.discount_amount || 0 }/-
                        </p>
                      </div>
    
                      <div style="width: 5rem">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0 auto;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          ${ data?.discount_amount || 0 }/-
                        </p>
                      </div>
    
                      <div style="width: 5rem">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0 auto;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          ${ data?.coupon_amount || 0 }/-
                        </p>
                      </div>
    
                      <div style="width: 5rem">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0 auto;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          ${ data?.heman_discount_amount || 0 }/-
                        </p>
                      </div>
    
                      <div style="width: 5rem">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0 auto;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          ${ data?.tax_amount || 0 }/-
                        </p>
                      </div>
    
                      <div style="width: 5rem">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: 400;
                            margin: 0 auto;
                            font-size: 11px;
                            padding-top: 4px;
                          "
                        >
                          ${ data?.convince_fee_amount || 0 }/-
                        </p>
                      </div>
    
                      <div style="height: 140px"></div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                style="
                  width: 97%;
                  border-top: 0.0625rem solid #0e5f9f;
                  border-bottom: 0.0625rem solid #0e5f9f;
                  margin-left: 5px;
                "
              >
                <tbody style="width: 100%">
                  <tr>
                    <td style="vertical-align: middle">
                      <p
                        style="
                          color: #123e6f;
                          font-weight: bold;
                          margin: 0;
                          font-size: 14px;
                        "
                      >
                        GRAND TOTAL
                      </p>
                    </td>
                    <td style="vertical-align: middle">
                      <p
                        style="
                          color: #123e6f;
                          font-weight: bold;
                          margin: 0;
                          font-size: 14px;
                          text-align: end;
                        "
                      >
                        <span style="vertical-align: bottom">
                          <img
                            src="`+ constants.INVOICE_RUPEE_IMAGE + `"
                            style="width: 14px; height: 14px"
                          />
                        </span>
                        ${ data?.amount || 0 }/-
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style="margin-top: 1rem; padding-left: 1rem">
                <table style="width: 100%">
                  <tbody style="width: 100%">
                    <tr>
                      <td style="width: 35%; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: bold;
                            margin: 0;
                            font-size: 11px;
                          "
                        >
                          Bank Name
                        </p>
                      </td>
                      <td style="width: 100px; padding: 0">
                        <p style="color: #123e6f; margin: 0; font-size: 11px">
                          ICICI Bank
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 35%; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: bold;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 2px;
                          "
                        >
                          Branch Name
                        </p>
                      </td>
                      <td style="width: 100px; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 2px;
                          "
                        >
                          Kalawad Road
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 35%; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: bold;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 2px;
                          "
                        >
                          Bank Account Number
                        </p>
                      </td>
                      <td style="width: 100px; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 2px;
                          "
                        >
                          624 805017419
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 35%; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: bold;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 2px;
                          "
                        >
                          Bank Branch IFSC
                        </p>
                      </td>
                      <td style="width: 100px; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 2px;
                          "
                        >
                          ICIC0006248
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 35%; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            font-weight: bold;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 2px;
                          "
                        >
                          HSN
                        </p>
                      </td>
                      <td style="width: 100px; padding: 0">
                        <p
                          style="
                            color: #123e6f;
                            margin: 0;
                            font-size: 11px;
                            padding-top: 2px;
                          "
                        >
                          9 9 9 2 9 4
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div
              style="
                padding-top: 1rem;
                padding-bottom: 0.5rem;
                width: 100%;
                text-align: center;
                margin-top: 5rem;
              "
            >
              <p
                style="
                  color: #123e6f;
                  font-weight: bold;
                  margin: 0;
                  font-size: 11px;
                "
              >
                THANK YOU FOR SUBSCRIBING TO OUR COURSE
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>    
    
      `

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