const { InvoiceSchema } = require('../schema');

const createInvoice = async (insertData) => {

    const invoice = new InvoiceSchema(insertData)

    const invoiceResult = await invoice.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return invoiceResult;
}

const updateInvoice = async (id,updateData) => {

    const invoiceResult =  await InvoiceSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return invoiceResult;
}

const findSubscriptionData = async (subscription_id) => {

    const invoiceData =  await InvoiceSchema.findOne({subscription_id: subscription_id}).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

   return invoiceData;
}

const findOrderData = async (order_id) => {

    const invoiceData =  await InvoiceSchema.findOne({order_id: order_id}).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

   return invoiceData;
}

const findByIdData = async (id) => {

    const invoiceData =  await InvoiceSchema.findOne({_id: id}).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

   return invoiceData;
}

const findInvoiceById = async (invoice_id) => {

    const invoiceData =  await InvoiceSchema.findOne({invoice_id: invoice_id}).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

   return invoiceData;
}

const findOrderById = async (order_id) => {

    const invoiceData =  await InvoiceSchema.findOne({order_id: order_id}).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

   return invoiceData;
}


const getPaymentHistory = async (userFilter) => {

    let filter = [];
    if(userFilter.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }

    if(userFilter.type){

        if(userFilter.type == 1){
            filter.push({
                invoice_type: 2
            })
        }else if(userFilter.type == 2){
            let orCondition = [];
            orCondition.push({
                invoice_type: 3
            })
            orCondition.push({
                invoice_type: 1
            })

            filter.push({
                $or: orCondition
            })
        }else if(userFilter.type == 3){
            let orCondition = [];
            orCondition.push({
                payment_status: 5
            })
            orCondition.push({
                payment_status: 6
            })
            orCondition.push({
                payment_status: 7
            })
            orCondition.push({
                payment_status: 8
            })

            filter.push({
                $or: orCondition
            })
        }
       
    }

    let getFilterData =  await InvoiceSchema.find( { $and: filter },{innitial_response: 0}).sort({ createdAt: -1 }).skip(userFilter.page).limit(userFilter.perPage).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const revenueData = async (startDate, endDate) => {
    let condition = []

    if(startDate && endDate){
        condition.push({
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
                payment_status: 2
            }
        })
    }else{
        condition.push({
            $match: {
                payment_status: 2
            }
        })
    }

    condition.push( {
        $group: {
          _id: null,
          amount: {
            $sum: "$amount",
          },
          user_count: {$sum: 1}
        }
      }, { $project: { _id: 0, amount: 1, user_count: 1 } })

    let data = await InvoiceSchema.aggregate(condition).then((userData) => {
        return userData?.length > 0 ? userData[0] : {}
    }).catch((err) => {
        return false
    });

   return data;
}


module.exports = {
    createInvoice,
    updateInvoice,
    findSubscriptionData,
    findOrderData,
    findInvoiceById,
    getPaymentHistory,
    findOrderById,
    findByIdData,
    revenueData
}