const { ValidateSignature } = require('../../utils');

module.exports = async (req,res,next) => {
    
    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){
        let userData = req.user;
        let route = req.originalUrl.split( "/" )
        let module = route?.[1] || null
        let apiname = route?.[2] || null

        if(userData.user_type === 5){
            //student
            return next();
        }else if(userData.user_type === 1 || userData.user_type === 2 || userData.user_type === 3 || userData.user_type === 4 || userData.user_type === 6 || userData.user_type === 7 || userData.user_type === 8){
           
           /*
                /user/bulkImport
                /user/checkUserEmail
                /user/checkUserMobile
                /user/addInstituteStudent
                /user/updateInstituteStudent
                /user/getStudentList
                /user/getallstudent
                /user/getAccountData
                /personalizedquiz/addQuiz
                /user/getStudentById 
                /user/countCourseUser 
                /user/checkUserSubscription 
                /coursewatchhistory/getCourseWatchHistory  
                /user/getLanguageData 
                /user/getEnrollmentData 
                /user/getCourseCompletionRateBycourse 
                /user/getMobileUsageData
                /user/getLoginHistoryData
                /user/getRegistrationHistoryData 
                /user/getRegistrationRateData 
                /user/getEnrollmentRateData 
                /user/getLoginFrequencyData
                /user/assignCourse
                /user/addStudents
                /user/updateStudentData
                /user/deleteStudent
                /user/assignCourseList
                /user/deleteUserCourse
                /user/resetProfileImage
                /user/changeStudentPassword
                /user/paymentHistory
                /user/invoice
                /user/getStudentCount
                /user/getPaymentHistory

                //chart api
                /user/stateWiseLocationDistribution
                /user/cityWiseLocationDistribution
                /user/getUserAgeData 
                /user/getGenderData 
                /user/signupDistribution 
                /user/osUsage 
                /user/userBase
                /user/userEngagement
            */
           
            let moduleArray = ['user','personalizedquiz','coursewatchhistory', 'feedback']
            let apiArray = ['bulkImport','checkUserEmail','checkUserMobile','addInstituteStudent','updateInstituteStudent','getStudentList','getallstudent','getAccountData',
                            'addQuiz','getStudentById','countCourseUser','checkUserSubscription','getCourseWatchHistory','getUserAgeData','getGenderData','getLanguageData',
                            'getEnrollmentData','getCourseCompletionRateBycourse','getMobileUsageData','getLoginHistoryData','getRegistrationHistoryData','getRegistrationRateData',
                            'getEnrollmentRateData','getLoginFrequencyData','assignCourse','addStudents','updateStudentData','deleteStudent','assignCourseList','deleteUserCourse',
                            'resetProfileImage','changeStudentPassword','paymentHistory','locationdistribution','invoice','stateWiseLocationDistribution','cityWiseLocationDistribution', 
                            'signupDistribution','osUsage','userBase','fetch','userEngagement',"getStudentCount", "delete","getPaymentHistory","cityDropdown","studentData","stateDropdown",
                            'studentDropdown','changeHemanStatus','getStudentWithAllData','getCouponUserList','getTopicViewHistory']
            if(moduleArray.includes(module) && apiArray.includes(apiname)){
                return next();
            }else{
                return res.status(403).json({message: 'Not Authorized', status: false, status_code: 403})
            }
        }
    }
    return res.status(403).json({message: 'Not Authorized', status: false, status_code: 403})
}