const { UserCourseSchema, UserEarningSchema } = require('../schema');
const moment = require('moment');

const assignUserCourse = async (insertData) => {

    const userCourse = new UserCourseSchema(insertData)

    const userCourseResult = await userCourse.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return userCourseResult;
}
 
const filterUserCourseData = async (userFilter) => {

    let filter = [];
    if(userFilter.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }

    if(userFilter.course_id){
        filter.push({
            course_id: userFilter.course_id
        })
    }

    if(userFilter.id){
        filter.push({
            _id: userFilter.id
        })
    }

    filter.push({
        is_deleted: false
    })

    let getFilterData =  await UserCourseSchema.findOne( { $and: filter }).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const getUserCourseData = async (userFilter) => {

    let filter = [];
    if(userFilter.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }
    if(userFilter.course_subscription_type){
        filter.push({
            course_subscription_type: userFilter.course_subscription_type
        })
    }

    if(userFilter.course_id){
        filter.push({
            course_id: userFilter.course_id
        })
    }

    if(userFilter.invoice_id){
        filter.push({
            invoice_id: userFilter.invoice_id
        })
    }

    filter.push({
        is_deleted: false
    })

    let getFilterData =  await UserCourseSchema.find( { $and: filter }).skip(userFilter.start).limit(userFilter.limit).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const getUserCourseCount = async (userFilter) => {

    let filter = [];
    if(userFilter.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }
    
    if(userFilter.course_subscription_type){
        filter.push({
            course_subscription_type: userFilter.course_subscription_type
        })
    }

    if(userFilter.course_id){
        filter.push({
            course_id: userFilter.course_id
        })
    }
    
    if(userFilter.invoice_id){
        filter.push({
            invoice_id: userFilter.invoice_id
        })
    }

    if(userFilter.type){
        filter.push({
            type: userFilter.type
        })
    }

    filter.push({
        is_deleted: false
    })

    let getFilterData =  await UserCourseSchema.count( { $and: filter }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const getUserCourse = async (userFilter) => {

    let filter = [];
    if(userFilter.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }
    
    if(userFilter.course_subscription_type){
        filter.push({
            course_subscription_type: userFilter.course_subscription_type
        })
    }

    if(userFilter.course_id){
        filter.push({
            course_id: userFilter.course_id
        })
    }
    
    if(userFilter.invoice_id){
        filter.push({
            invoice_id: userFilter.invoice_id
        })
    }

    filter.push({
        is_deleted: false
    })

    let getFilterData =  await UserCourseSchema.find( { $and: filter }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const updateUserCourse = async (id,updateData) => {

    const userCourseResult = UserCourseSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return userCourseResult;
}

const updateUserCourseUsingInvoice = async (id,updateData) => {

    const userCourseResult = UserCourseSchema.updateOne({invoice_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return userCourseResult;
}

const getCourseEnrollmentData = async (start_date) => {

    const data = await UserCourseSchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(start_date)
                },
            },
        },
        { 
            $group: {
                _id: {
                    $dateToString: {
                        date: "$createdAt" ,
                        format: "%Y-%m"
                    }
                },
                enrollment: { $count: {} }
            }
        }
    ]).then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const getCourseEnrollmentDataCourseWise = async () => {

    const data = await UserCourseSchema.aggregate([
        {
            $match: {
                course_id: {
                    $ne: null
                },
            },
        },
        { 
            $group: {
                _id: "$course_id",
                enrollment: { $count: {} }
            }
        }
    ]).then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const getCourseEnrollmentRateData = async (start_date, dateformate) => {

    const usermobileactivityData = await UserCourseSchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(start_date)
                }
            },
        },
        {
            $group: {
                _id: { 
                    $dateToString: {
                        date: "$createdAt" ,
                        format: dateformate
                    }
                },
                totalRegistrations: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 1,
              day: "$_id.day",
              userCount: {
                $multiply: [
                  { $divide: ["$totalRegistrations", 7] }, // Divide by 7 to get daily average
                  100
                ]
              }
            }
          },
          {
            $sort: { day: 1 } // Sort by day in ascending order
          }
    ]).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return usermobileactivityData;
}

const getCourseEnrollmentPercentageData = async (start_date) => {

    const data = await UserCourseSchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(start_date)
                },
            },
        },
        {
          $group: {
            _id: {
              course: "$course_id",
              day: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.day",
            enrollments: {
              $push: {
                course: "$_id.course",
                count: "$count"
              }
            },
            totalEnrollments: { $sum: "$count" }
          }
        },
        {
          $project: {
            _id: 1,
            day: "$_id",
            enrollments: 1,
            percentage: {
              $map: {
                input: "$enrollments",
                as: "enrollment",
                in: {
                  course: "$$enrollment.course",
                  count: "$$enrollment.count",
                  percentage: {
                    $multiply: [
                      { $divide: ["$$enrollment.count", "$totalEnrollments"] },
                      100
                    ]
                  }
                }
              }
            }
          }
        }
      ]).then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const getUserCourseLearningData = async (userFilter) => {

    let filter = [];
    if(userFilter?.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }

    filter.push({
        is_deleted: false
    })

    let getFilterData =  await UserCourseSchema.find( { $and: filter }).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const checkCourseSubscription = async () => {

    let getFilterData =  await UserCourseSchema.updateMany({
        $expr: {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$expire_date" } },
            { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
          ]
        }
    }, { $set: { is_expired : true, expire_by_cron_at: new Date(), is_deleted: true } }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const filterInvoiceCourse = async (invoice_id) => {

    let getFilterData =  await UserCourseSchema.findOne( { $and: {
        user_id: invoice_id
    } }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const getUserBySubscriptionId = async (subscription_id) => {
    const filter = {
        subscription_id: subscription_id,
        is_deleted: false
      };
  
      const userData = await UserCourseSchema.findOne(filter);
      return userData;
}

const getExpiringSoonCourses = async (userFilter) => {
    // Calculate the date expiration days from now
    const expiryDate = moment().add(userFilter.expiration_days, 'days').toDate();
    // Find records where the expire_by field is after 7 days from now
    
    let getFilterData =  await UserCourseSchema.find({
        $expr: {
          $eq: [
            { $dateToString: { format: "%Y-%m-%d", date: "$expire_date" } },
            { $dateToString: { format: "%Y-%m-%d", date: expiryDate } }
          ]
        },is_deleted: false
    }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}


const deleteAssignCourse = async (user_id, course_id) => {

    const userCourseResult = UserCourseSchema.updateOne({user_id: user_id, course_id: course_id}, {
        is_deleted: true
    }).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return userCourseResult;
}

const getUserBaseCount = async (userFilter) => {

    let filter = [];
    
    if(userFilter.type){
        filter.push({
            type: userFilter.type
        })
    }

    if(userFilter.startDate && userFilter.endDate){
        filter.push({
            createdAt: {
                $gte: new Date(userFilter.startDate),
                $lte: new Date(userFilter.endDate),
            }
        })
    }

    filter.push({
        is_deleted: false
    })

    let getFilterData =  await UserCourseSchema.find( { $and: filter }).distinct("user_id").then((data) => {
        return data.length
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const getUserCourseList = async (userFilter) => {

    let filter = [];
    if(userFilter.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }

    let getFilterData =  await UserCourseSchema.find( { $and: filter }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const userEarning = async (insertData) => {

    const userCourse = new UserEarningSchema(insertData)

    const userCourseResult = await userCourse.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return userCourseResult;
}

const deleteUserEarning = async (orderId) => {

    const deleteData = await UserEarningSchema.deleteOne({ order_id: orderId }).then((data) => {
        return true
    }).catch((err) => {
        return false
    });
    return deleteData;
}

const getUserEarningHistory = async (userFilter) => {

    let filter = [];
    if(userFilter.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }
    if(userFilter.transaction_type){
        filter.push({
            transaction_type: userFilter.transaction_type
        })
    }

    let getFilterData =  await UserEarningSchema.find( { $and: filter }).skip(userFilter.start).limit(userFilter.limit).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const getUserWithdrawAmount = async (userInputs) => {

    let thirtyDaysAgo = new Date();
    if(userInputs?.transaction_type == 1 && userInputs?.with_date == 1){
        // Calculate the date 30 days ago
        thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    }
   

    const withdrawAmount = await UserEarningSchema.aggregate([
        {
            $match: {
                createdAt: { $lte: thirtyDaysAgo },
                user_id: userInputs.user_id,
                transaction_type: userInputs.transaction_type
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: '$amount' },
            },
        },
    ]).then((result) => {
        if (result.length > 0) {
            return result[0].totalAmount;
        } else {
            return 0
        }
    })
    .catch((error) => {
        return 0
    });

    return withdrawAmount
}

const countTransation = async (userInputs) => {

    let filter = [];
    if(userInputs.user_id){
        filter.push({
            user_id: userInputs.user_id
        })
    }
    if(userInputs.transaction_type){
        filter.push({
            transaction_type: userInputs.transaction_type
        })
    }

    let getFilterData =  await UserEarningSchema.count( { $and: filter }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

const updateUserEarning = async (id,updateData) => {

    const UserEarningResult = UserEarningSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return UserEarningResult;
}

const getUserCoursePurchaseList = async (userFilter) => {

    let filter = [];
    if(userFilter.user_id){
        filter.push({
            user_id: userFilter.user_id
        })
    }

    filter.push({
        type: 2
    })
    filter.push({
        payment_status: 2
    })

    let getFilterData =  await UserCourseSchema.find( { $and: filter }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return getFilterData;
}

module.exports = {
    assignUserCourse,
    filterUserCourseData,
    getUserCourseData,
    getUserCourse,
    getUserCourseCount,
    updateUserCourse,
    getCourseEnrollmentData,
    getCourseEnrollmentDataCourseWise,
    getCourseEnrollmentRateData,
    getCourseEnrollmentPercentageData,
    getUserCourseLearningData,
    checkCourseSubscription,
    filterInvoiceCourse,
    getUserBySubscriptionId,
    updateUserCourseUsingInvoice,
    getExpiringSoonCourses,
    deleteAssignCourse,
    getUserBaseCount,
    getUserCourseList,
    userEarning,
    deleteUserEarning,
    getUserEarningHistory,
    getUserWithdrawAmount,
    countTransation,
    updateUserEarning,
    getUserCoursePurchaseList
}