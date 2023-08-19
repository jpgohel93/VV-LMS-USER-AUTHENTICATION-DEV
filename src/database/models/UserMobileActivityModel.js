const { UserMobileActivitySchema, UserLoginHistorySchema } = require('../schema');

const createUserMobileActivity = async (insertData) => {

    const usermobileactivity = new UserMobileActivitySchema(insertData)

    const usermobileactivityResult = await usermobileactivity.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return usermobileactivityResult;
}

const fatchUserMobileActivityList = async (user_id) => {

    const usermobileactivityData = await UserMobileActivitySchema.find({ 
        $and: [
            {
                user_id: user_id
            }
        ]
    }).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return usermobileactivityData;
}


const updateUserMobileActivity = async (id,updateData) => {

    const userMobileActivityResult = UserMobileActivitySchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return userMobileActivityResult;
}

const createUserLoginHistory = async (insertData) => {

    const usermobileactivity = new UserLoginHistorySchema(insertData)

    const usermobileactivityResult = await usermobileactivity.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return usermobileactivityResult;
}

const fatchUserLoginHistoryList = async (user_id) => {

    const usermobileactivityData = await UserLoginHistorySchema.find({ 
        $and: [
            {
                user_id: user_id
            }
        ]
    }).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return usermobileactivityData;
}

const getMobileUsageInWeekData = async (start_date) => {

    const usermobileactivityData = await UserMobileActivitySchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(start_date)
                },
                end_time: {
                    $ne: null
                }
            },
        },
        { 
            $group: {
                _id: { 
                        $dateToString: {
                            date: "$createdAt" ,
                            format: "%w"
                        }
                },
                totalMinites: {
                    $sum: {
                        $divide: [
                            { $subtract: [ "$end_time", "$start_time" ] },
                            1000 * 60 * 60
                        ]
                    }
                }
            }
        }
    ]).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return usermobileactivityData;
}

const getMobileUsageInDaysData = async (start_date) => {

    const usermobileactivityData = await UserMobileActivitySchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(start_date)
                },
                end_time: {
                    $ne: null
                }
            },
        },
        { 
            $group: {
                _id: { 
                        $dateToString: {
                            date: "$createdAt" ,
                            format: "%m-%d"
                        }
                },
                totalMinites: {
                    $sum: {
                        $divide: [
                            { $subtract: [ "$end_time", "$start_time" ] },
                            1000 * 60 * 60
                        ]
                    }
                }
            }
        }
    ]).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return usermobileactivityData;
}

const getMobileUsageInMonthData = async (start_date) => {

    const usermobileactivityData = await UserMobileActivitySchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(start_date)
                },
                end_time: {
                    $ne: null
                }
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
                totalMinites: {
                    $sum: {
                        $divide: [
                            { $subtract: [ "$end_time", "$start_time" ] },
                            1000 * 60 * 60
                        ]
                    }
                }
            }
        }
    ]).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return usermobileactivityData;
}

const getLoginHistoryData = async (start_date, dateformate) => {

    const usermobileactivityData = await UserLoginHistorySchema.aggregate([
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
                userCount: { $count: {} }
            }
        }
    ]).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return usermobileactivityData;
}

const getLoginFrequencyData = async () => {

    const usermobileactivityData = await UserLoginHistorySchema.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)) // Start date for the last month
            }
          }
        },
        {
          $group: {
            _id: {
                $toDate: {
                  $subtract: [
                    { $toLong: "$createdAt" },
                    {
                      $mod: [
                        { $toLong: "$createdAt" },
                        10 * 24 * 60 * 60 * 1000 // Group by intervals of 10 days
                      ]
                    }
                  ]
                }
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            rangeTitle: {
                $concat: [
                  { $dateToString: { format: "%Y-%m-%d", date: { $add: ["$_id", 1] } } },
                  " - ",
                  { $dateToString: { format: "%Y-%m-%d", date: "$_id" } }
                ]
            },
            count: 1
          }
        },
        {
          $sort: {
            rangeTitle: 1
          }
        }
      ]).then((data) => {
        return data
    }).catch((err) => {
        console.log("err :::", err)
        return null
    });
    return usermobileactivityData;
}

const getUserEngagement = async ({ startDate, endDate }) => {

       // Get the start time and end time for the selected date
       const startTime = new Date(startDate);
       startTime.setHours(0, 0, 0, 0); // Set to 00:00:00:000
       const endTime = new Date(endDate);
       endTime.setHours(23, 59, 59, 999); // Set to 23:59:59:999
   
       // Match documents within the selected date range
       const matchStage = {
         $match: {
           start_time: { $gte: startTime },
           end_time: { $lte: endTime },
         },
       };
   
       // Project the hour from the start_time and end_time fields
       const projectStage = {
         $project: {
           hour: { $hour: '$start_time' },
           duration: { $divide: [{ $subtract: ['$end_time', '$start_time'] }, 3600000] },
         },
       };
   
       // Unwind the documents based on the duration
       const unwindStage = {
         $unwind: {
           path: '$hour',
           includeArrayIndex: 'hourIndex',
           preserveNullAndEmptyArrays: true,
         },
       };
   
       // Group by the hour and count the number of users
       const groupStage = {
         $group: {
           _id: '$hour',
           count: { $sum: 1 },
         },
       };
   
       // Sort the results by the hour in ascending order
       const sortStage = {
         $sort: { _id: 1 },
       };
   
        // Execute the aggregation pipeline
        const hourlyChartData = await UserMobileActivitySchema.aggregate([
            matchStage,
            projectStage,
            unwindStage,
            groupStage,
            sortStage,
        ]).then((model) => {
        return model
        }).catch((err) => {
            return false
        });
   
       return hourlyChartData;
}


module.exports = {
    createUserMobileActivity,
    fatchUserMobileActivityList,
    updateUserMobileActivity,
    createUserLoginHistory,
    fatchUserLoginHistoryList,
    getMobileUsageInWeekData,
    getMobileUsageInDaysData,
    getMobileUsageInMonthData,
    getLoginHistoryData,
    getLoginFrequencyData,
    getUserEngagement
}