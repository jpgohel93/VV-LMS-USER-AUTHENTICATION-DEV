const userCourseService = require('../../services/userCourseService');

module.exports = async (app) => {
    app.get('/usercron/checkCourseSubscription',async (req,res,next) => {
        const data = await userCourseService.checkexpiredCourse(); 
        res.status(data.status_code).json(data);
    });

    app.get('/usercron/sendCourseExpiryReminder',async (req,res,next) => {
        const data = await userCourseService.getExpiringCourses();
        res.status(data.status_code).json(data);
    });
}