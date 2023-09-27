const { UserSchema } = require('../schema');

const createUser = async (insertData) => {

    const admin = new UserSchema(insertData)

    const adminResult = await admin.save().then((data) => {
        return data;
    }).catch((err) => {
        return null;
    });

    return adminResult;

}

const fatchUserData = async (username, google_login_id = null, facebook_login_id = null, linkdin_login_id = null, apple_login_id = null) => {
    let filter = [];
    if(username){
        filter.push(
            {
                mobile_no: username
            },
            {
                email: username
            }
        );
    } else if(google_login_id){
        filter.push(
            {
                google_login_id: google_login_id
            }
        );
    } else if(facebook_login_id){
        filter.push(
            {
                facebook_login_id: facebook_login_id
            }
        );
    } else if(linkdin_login_id){
        filter.push(
            {
                linkdin_login_id: linkdin_login_id
            }
        );
    } else if(apple_login_id){
        filter.push(
            {
                apple_login_id: apple_login_id
            }
        );
    }

    let existingUser =  await UserSchema.findOne( { $and: [{is_deleted: false},{$or: filter}] }).then((data) => {
        return data;
    }).catch((err) => {
        return null;
    });

    return existingUser;

}

const fatchUserfilterData = async (userFilter) => {
    let filter = [];
    if(userFilter.email){
        filter.push({
            email: userFilter.email
        })
    }

    if(userFilter.mobile_no){
        filter.push({
            mobile_no: userFilter.mobile_no
        })
    }

    if(userFilter.user_referral_code){
        filter.push({
            user_referral_code: userFilter.user_referral_code
        })
    }

    filter.push({
        is_deleted: false
    });

    let getFilterData =  await UserSchema.findOne( { $and: filter }).then((data) => {
        return data;
    }).catch((err) => {
        return null;
    });

    return getFilterData;
}

const fatchStudents = async (search, start, limit, institute_id, referral_code) => {
    let searchFilter = [];
    if(search){
        searchFilter.push({
            $or: [
                {
                    first_name: { $regex: '.*' + search + '.*', $options:'i' }
                },
                {
                    last_name: { $regex: '.*' + search + '.*', $options:'i' }
                },
                {
                    email: { $regex: '.*' + search + '.*', $options:'i' }
                },
                {
                    mobile_no: { $regex: '.*' + search + '.*', $options:'i' }
                }
            ]
        })
    }

    if(institute_id){
        searchFilter.push({
            institute_id: institute_id
        })
    }
    if(referral_code){
        searchFilter.push({
            referral_code: referral_code
        })
    }

    searchFilter.push({
        is_deleted: false
    });

    searchFilter.push({
        is_verify_otp: true
    });

    const studentsData = await UserSchema.find({ 
        $and: searchFilter
    },{user_type: 1,status: 1,is_get_notification: 1,app_language: 1,createdAt: 1,updatedAt: 1,birth_date: 1,country_code: 1,email: 1,first_name: 1,gender: 1,last_name: 1,mobile_no: 1,note: 1,profile_image :1,user_signup_with: 1, is_heman: 1})
    .sort({ createdAt: -1 }).skip(start).limit(limit).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return studentsData;
}

const countStudents = async (search,institute_id, startDate, endDate, referral_code) => {
    let searchFilter = [];
    if(search){
        searchFilter.push({
            $or: [
                {
                    first_name: { $regex: '.*' + search + '.*', $options:'i' }
                },
                {
                    last_name: { $regex: '.*' + search + '.*', $options:'i' }
                },
                {
                    email: { $regex: '.*' + search + '.*', $options:'i' }
                },
                {
                    mobile_no: { $regex: '.*' + search + '.*', $options:'i' }
                }
            ]
        })
    }

    if(institute_id){
        searchFilter.push({
            institute_id: institute_id
        })
    }

    if(referral_code){
        if(referral_code == 1){
            searchFilter.push({
                referral_code: {$ne : null}
            })
        }else{
            searchFilter.push({
                referral_code: referral_code
            })
        }
    }

    if(startDate && endDate){
        searchFilter.push({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            }
        })
    }

    searchFilter.push({
        is_deleted: false
    });

    searchFilter.push({
        is_verify_otp: true
    });

    const studentsData = await UserSchema.count({ 
        $and: searchFilter
    }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return studentsData;
}

//update publisher data
const updateUser = async (id,updateData) => {

    const publisherResult = UserSchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return publisherResult;
} 

const fatchUserById = async (id) => {

    const userResult = UserSchema.findOne({_id: id})
    .then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return userResult;
}

const fatchUserDataById = async (id) => {

    const userResult = UserSchema.findOne({_id: id},{password: 0, password_salt: 0 })
    .then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return userResult;
}

const getAgeData = async (startDate, endDate) => {
    let condition = []

    if(startDate && endDate){
        condition.push({
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                }
            },
        })
    }

    condition.push( { 
            "$project": {
                "age": {
                    "$divide": [
                        {
                            "$subtract": [
                                new Date(),
                                { "$ifNull": ["$birth_date", new Date()] }
                            ]
                        },
                        1000 * 86400 * 365
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "$concat": [
                        { "$cond": [ { "$and": [ { "$gt":  ["$age", 0 ] }, { "$lt": ["$age", 16] } ]}, "below 16", ""] },
                        { "$cond": [ { "$and": [ { "$gte": ["$age", 17] }, { "$lt": ["$age", 28] } ]}, "17 - 28", ""] },
                        { "$cond": [ { "$and": [ { "$gte": ["$age", 28] }, { "$lte": ["$age", 45] } ]}, "28 - 45", ""] },
                        { "$cond": [  {"$gt": ["$age", 45]}, "45+", ""] }
                    ]
                },
                "personas": { "$sum": 1 }
            }
        },
        { "$project": { "_id": 0, "age": "$_id", "personas": 1 } }
    )

    let data = await UserSchema.aggregate(condition).then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const getGenderData = async (startDate, endDate) => {

    let data = await UserSchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
                is_deleted: false
            },
        },
        {$project: {
          male: {$cond: [{$eq: [{ $toLower: "$gender" }, "male"]}, 1, 0]},
          female: {$cond: [{$eq: [{ $toLower: "$gender" }, "female"]}, 1, 0]},
        }},
        {$group: { _id: null, male: {$sum: "$male"},
                              female: {$sum: "$female"},
                              total: {$sum: 1},
        }},
        { "$project": { "_id": 0, "male": 1, "female": 1, "total": 1 } }
      ]).then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const getLanguageData = async () => {

    let data = await UserSchema.aggregate([
        {$project: {
            gujrati: {$cond: [{$eq: [{ $toLower: "$app_language" }, "gujrati"]}, 1, 0]},
            hindi: {$cond: [{$eq: [{ $toLower: "$app_language" }, "hindi"]}, 1, 0]},
            english: {$cond: [{$eq: [{ $toLower: "$app_language" }, "english"]}, 1, 0]},
        }},
        {$group: { _id: null, gujrati: {$sum: "$gujrati"},
                              hindi: {$sum: "$hindi"},
                              english: {$sum: "$english"},
                              total: {$sum: 1},
        }},
        { "$project": { "_id": 0, "gujrati": 1, "hindi": 1, "english": 1, "total": 1 } }
      ]).then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const getRegistrationHistoryData = async (start_date, dateformate) => {

    const usermobileactivityData = await UserSchema.aggregate([
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

const getRegistrationRateData = async (start_date, dateformate) => {

    const usermobileactivityData = await UserSchema.aggregate([
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

const getAllStudent = async (userFilter) => {

    let searchFilter = [];

    if(userFilter.search){
        searchFilter.push({
            $or: [
                {
                    first_name: { $regex: '.*' + userFilter.search + '.*', $options:'i' }
                },
                {
                    last_name: { $regex: '.*' + userFilter.search + '.*', $options:'i' }
                },
                {
                    email: { $regex: '.*' + userFilter.search + '.*', $options:'i' }
                },
                {
                    mobile_no: { $regex: '.*' + userFilter.search + '.*', $options:'i' }
                }
            ]
        })
    }

    if(userFilter.referral_code_array && userFilter.referral_code_array.length > 0){
        searchFilter.push({
            referral_code: { $in : userFilter.referral_code_array }
        });
    }else if(userFilter.referral_code){
        searchFilter.push({
            referral_code: userFilter.referral_code
        });
    }

    if(userFilter.purchase_course){
        if(userFilter.purchase_course == 1){
            searchFilter.push({
                purchase_course: { $eq: true }
            });
        }else if(userFilter.purchase_course == 2){
            searchFilter.push({
                purchase_course: { $eq: false }
            });
        }
    }
    
    searchFilter.push({
        is_deleted: false
    });

    if(userFilter.endToken){
        const studentsData = await UserSchema.find({ 
            $and: searchFilter
        },{createdAt: 1,country_code: 1,email: 1,first_name: 1,last_name: 1,mobile_no: 1,profile_image :1}).skip(userFilter.startToken).limit(userFilter.endToken).then((data) => {
            return data
        }).catch((err) => {
            return null
        });
        return studentsData;
    }else if(userFilter.count_record){
        const studentsData = await UserSchema.count({ 
            $and: searchFilter
        }).then((data) => {
            return data
        }).catch((err) => {
            return null
        });
        return studentsData;
    }else{

        const studentsData = await UserSchema.find({ 
            $and: searchFilter
        },{createdAt: 1,country_code: 1,email: 1,first_name: 1,last_name: 1,mobile_no: 1,profile_image :1}).then((data) => {
            return data
        }).catch((err) => {
            return null
        });
        return studentsData;
    }

}

const getStateWiseLocationDistributionData = async (startDate, endDate) => {

    let condition = []

    if(startDate && endDate){
        condition.push({
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
                is_deleted: false
            },
        })
    }else{
        condition.push({
            $match: {
                is_deleted: false
            }
        })
    }

    condition.push({
            $group: {
                _id:  "$state",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                state: {
                    $cond: {
                        if: { $eq: ["$_id", null] },
                        then: "Other",
                        else: {
                            $concat: [
                                { $toUpper: { $substrCP: ["$_id", 0, 1] } },
                                { $substrCP: ["$_id", 1, { $strLenCP: "$_id" }] }
                            ]
                        }
                    }
                },
                count: 1
            }
        }
    )

    const chartData = await UserSchema.aggregate(condition).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return chartData;
}

const getCityWiseLocationDistributionData = async (startDate, endDate) => {

    let condition = []

    if(startDate && endDate){
        condition.push({
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
                is_deleted: false
            },
        })
    }else{
        condition.push({
            $match: {
                is_deleted: false
            }
        })
    }

    condition.push({
            $group: {
                _id:  "$city",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                city: {
                    $cond: {
                        if: { $eq: ["$_id", null] },
                        then: "Other",
                        else: {
                            $concat: [
                                { $toUpper: { $substrCP: ["$_id", 0, 1] } },
                                { $substrCP: ["$_id", 1, { $strLenCP: "$_id" }] }
                            ]
                        }
                    }
                },
                count: 1
            }
        }
    )

    const chartData = await UserSchema.aggregate(condition).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return chartData;
}

const getSignupDistribution = async (startDate, endDate) => {

    const chartData = await UserSchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
                is_deleted: false
            },
        },
        {
            $group: {
                _id:  "$device_type",
                count: { $sum: 1 }
            }
        }
    ]).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return chartData;
}

const getOSUsage = async (startDate, endDate) => {

    const chartData = await UserSchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
                is_deleted: false
            },
        },
        {
            $group: {
                _id:  "$operating_system",
                count: { $sum: 1 }
            }
        }
    ]).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return chartData;
}

const getStudentsByIds = async (id) => {
    // {first_name: 1,last_name: 1,email: 1,country_code: 1,mobile_no: 1}
    
    const userResult = UserSchema.find({ _id: { $in: id } }).select('first_name last_name email country_code mobile_no').then((userData) => {
        return userData
    }).catch((err) => {
        console.log('err :: ',err);
        return false
    });

   return userResult;
}

const dailyReportAgeData = async (startDate, endDate) => {
    let condition = []

    if(startDate && endDate){
        condition.push({
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
                is_deleted: false
            },
        })
    }else{
        condition.push({
            $match: {
                is_deleted: false
            }
        })
    }

    condition.push(
        { 
            "$project": {
                "age": {
                    "$divide": [
                        {
                            "$subtract": [
                                new Date(),
                                { "$ifNull": ["$birth_date", new Date()] }
                            ]
                        },
                        1000 * 86400 * 365
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "$concat": [
                        { "$cond": [ { "$and": [ { "$gt":  ["$age", 0 ] }, { "$lt": ["$age", 16] } ]}, "below 16", ""] },
                        { "$cond": [ { "$and": [ { "$gte": ["$age", 17] }, { "$lt": ["$age", 28] } ]}, "17 - 28", ""] },
                        { "$cond": [ { "$and": [ { "$gte": ["$age", 28] }, { "$lte": ["$age", 45] } ]}, "28 - 45", ""] },
                        { "$cond": [  {"$gt": ["$age", 45]}, "45+", ""] }
                    ]
                },
                "personas": { "$sum": 1 }
            }
        },
        { "$project": { "_id": 0, "age": "$_id", "personas": 1 } }
    )

    let data = await UserSchema.aggregate(condition).then((userData) => {
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const getCityList = async () => {
    const data = await UserSchema.aggregate([
        {
            $match: {
                city: { $ne: null}
            }
        },
        { 
            $group: {
                _id: "$city"
            }
        },{
            $project:{
                _id: 0,
                city: "$_id"
            }
        }
    ]).then((userData) => {
        userData.push({
            city: "Other"
        })
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const getStateList = async () => {
    const data = await UserSchema.aggregate([
        {
            $match: {
                state: { $ne: null }
            }
        },
        { 
            $group: {
                _id: "$state"
            }
        },{
            $project:{
                _id: 0,
                state: "$_id"
            }
        }
    ]).then((userData) => {
        userData.push({
            state: "Other"
        })
        return userData
    }).catch((err) => {
        return false
    });

   return data;
}

const studentData = async (userFilter) => {
    let condition = []
    let matchcondition = {}

    matchcondition['is_deleted'] = false

    if(userFilter?.city?.length > 0){
        if(userFilter.city.includes("Other")){
            let orCondition = []
            orCondition.push( { city :{ $in : userFilter.city } })
            orCondition.push( { city :{ $eq: null } })
        
            matchcondition['$or'] = orCondition
        }else{
            matchcondition['city'] = { $in : userFilter.city }
        }
    }

    if(userFilter?.state?.length > 0){
        if(userFilter.state.includes("Other")){
            let orCondition = []
            orCondition.push( { state :{ $in : userFilter.state } })
            orCondition.push( { state :{ $eq: null } })
        
            matchcondition['$or'] = orCondition
        }else{
            matchcondition['state'] = { $in : userFilter.state }
        }
    }

    if(userFilter.start_date && userFilter.end_date){
        let startDate = new Date(userFilter.start_date).toISOString();
        let endDate = new Date(userFilter.end_date + " 23:59:59").toISOString();

        matchcondition['createdAt'] = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        }
    }

    if(userFilter.gender && userFilter.gender !== "all"){
        matchcondition['gender'] = { $regex: new RegExp(userFilter.gender, "i") }
    }

    if(userFilter?.age_group?.length > 0){
        condition.push({ 
            $project: {
                age: {
                    $divide: [
                        {
                            $subtract: [
                                new Date(),
                                { $ifNull: ["$birth_date", new Date()] }
                            ]
                        },
                        1000 * 86400 * 365
                    ]
                },
                is_deleted: "$is_deleted",
                gender: "$gender",
                createdAt: "$createdAt",
                city: "$city",
                state: "$state",
                first_name: "$first_name",
                last_name: "$last_name",
                device_uuid: "$device_uuid",
                notification_device_id: "$notification_device_id",
                email: "$email",
                country_code: "$country_code",
                mobile_no: "$mobile_no"
            }
        })

        let orCondition = []

        userFilter.age_group.forEach(element => {
            if(element == "10 to 16"){
                orCondition.push({ age :{ $gte: 10, $lte: 16 }})
            }else if(element == "17 to 28"){
                orCondition.push({ age :{ $gte: 17, $lte: 28 }})
            }else if(element == "29 to 45"){
                orCondition.push({ age :{ $gte: 29, $lte: 45 }})
            }else if(element == "45 to 60"){
                orCondition.push({ age :{ $gte: 45, $lte: 60 }})
            }else if(element == "Other"){
                orCondition.push({ age :{ $gt: 60 }})
                orCondition.push({ age :{ $gte: 0, $lt: 10 }})
            }
        });

        matchcondition['$or'] = orCondition
    }
   
    condition.push({
        $match: matchcondition
    })

    condition.push({
        $project: {
            first_name: "$first_name",
            last_name: "$last_name",
            device_uuid: "$device_uuid",
            notification_device_id: "$notification_device_id",
            email: "$email",
            country_code: "$country_code",
            mobile_no: "$mobile_no"
        }
    })

    const data = await UserSchema.aggregate(condition).then((userData) => {
        if(userFilter.is_count_record){
            return userData?.length || 0
        }else{
            return userData
        }
       
    }).catch((err) => {
        return false
    });

   return data;
}

const getCouponUserList = async (userFilter) => {

    let searchFilter = [];

    if(userFilter.search){
        searchFilter.push({
            $or: [
                {
                    first_name: { $regex: '.*' + userFilter.search + '.*', $options:'i' }
                },
                {
                    last_name: { $regex: '.*' + userFilter.search + '.*', $options:'i' }
                },
                {
                    email: { $regex: '.*' + userFilter.search + '.*', $options:'i' }
                },
                {
                    mobile_no: { $regex: '.*' + userFilter.search + '.*', $options:'i' }
                }
            ]
        })
    }

    if(userFilter.list_type ){
        if(userFilter.list_type == 1 && userFilter?.coupon_students?.length > 0){
            searchFilter.push({
                _id: { $nin: userFilter.coupon_students }
            });
        }else if(userFilter.list_type == 2 && userFilter?.coupon_students?.length > 0){
            searchFilter.push({
                _id: { $in: userFilter.coupon_students }
            });
        }else if(userFilter.list_type == 2 && userFilter?.coupon_students?.length == 0){
            return []
        }
    }
    
    searchFilter.push({
        is_deleted: false
    });

    const studentsData = await UserSchema.find({ 
        $and: searchFilter
    },{createdAt: 1,country_code: 1,email: 1,first_name: 1,last_name: 1,mobile_no: 1,profile_image :1}).skip(userFilter.page).limit(userFilter.perPage).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return studentsData;

}


module.exports = {
    createUser,
    updateUser,
    fatchUserData,
    fatchUserDataById,
    fatchUserfilterData,
    fatchStudents,
    fatchUserById,
    countStudents,
    getAgeData,
    getGenderData,
    getLanguageData,
    getRegistrationHistoryData,
    getRegistrationRateData,
    getAllStudent,
    getStateWiseLocationDistributionData,
    getCityWiseLocationDistributionData,
    getSignupDistribution,
    getOSUsage,
    getStudentsByIds,
    dailyReportAgeData,
    getCityList,
    getStateList,
    studentData,
    getCouponUserList
}