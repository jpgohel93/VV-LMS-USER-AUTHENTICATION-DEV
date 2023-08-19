const Razorpay = require('razorpay');

//Utility functions

module.exports.createRazorInstance = async () => {
    if (process.env.PAYMENT_MODE == "TEST") {
        var keyId = process.env.RAZOR_KEY_TEST;
        var secretKey = process.env.RAZOR_SECRET_TEST;
    } else {
        var keyId = process.env.RAZOR_KEY_TEST;
        var secretKey = process.env.RAZOR_SECRET_LIVE;
    }
    var instance = new Razorpay({
        key_id: keyId,
        key_secret: secretKey,
    })
    return await instance;
};


//create a razorpay subscription

module.exports.createSubscription = async (createPlanReq) => {
    const { razorPayPlanId, customer_notify, total_count,reference_id, notify_by_email,  notify_by_mobile_no, expire_by} = createPlanReq;

    let instance;

    let notifyBy = {}

    if(notify_by_email){
        notifyBy["notify_phone"] = notify_by_email
    }
    if(notify_by_mobile_no){
        notifyBy["notify_email"] = notify_by_mobile_no
    }

    return this.createRazorInstance()
        .then((razorInstance) => {
            instance = razorInstance;

            const subscriptionOptions = {
                plan_id: razorPayPlanId,
                customer_notify: customer_notify,
                total_count: total_count,
                notes: {
                    reference_id: reference_id
                },
                notify_info: notifyBy,
                expire_by: expire_by
            };
   
            return instance.subscriptions.create(subscriptionOptions);
        })
        .then((createPlanResponse) => {
            return {
                status: true,
                data: createPlanResponse
            };
        })
        .catch((error) => {
            console.error('Error creating subscription:', error);
            return {
                status: false,
                message: error.message,
            };
        });
};

//create payment order
module.exports.createPaymentOrder = async (createCustomerReq) => {
    const { amount, currency, receipt } = createCustomerReq;
    const options = {
        amount,
        currency,
        receipt
    };
    const instance = await this.createRazorInstance();
    return new Promise((resolve, reject) => {
        instance.orders.create(options, function (err, order) {
            if (err) {
                console.error('Error creating order:', err);
                reject({
                    status: false,
                    message: err.message
                });
            } else {
                resolve({
                    status: true,
                    message: 'Order ID has been created',
                    data: order
                });
            }
        });
    }).then((response) => {
            // Handle success
            return response;
    }).catch((error) => {
            // Handle error
        console.error('Error creating order:', error);
        return {
            status: false,
            message: error.message
        };
    });
};

//cancel course subscription
module.exports.cancelSubscription = async (createPlanReq) => {
    const { subscription_id } = createPlanReq;

    let instance;

    return this.createRazorInstance()
        .then((razorInstance) => {
            instance = razorInstance;
            
            return instance.subscriptions.cancel(subscription_id, true);
        })
        .then((cancelPlanResponse) => {
            return {
                status: true,
                data: cancelPlanResponse
            };
        })
        .catch((error) => {
            console.error('Error canceling subscription:', error);
            return {
                status: false,
                message: error.message,
            };
        });
};

