const { CourseWatchHistorySchema } = require('../schema');

const createCourseWatchHistory = async (insertData) => {

    const CourseWatchHistory = new CourseWatchHistorySchema(insertData)

    const CourseWatchHistoryResult = await CourseWatchHistory.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return CourseWatchHistoryResult;
}

const fatchCourseWatchHistoryList = async (user_id) => {

    const coursewatchhistoryData = await CourseWatchHistorySchema.find({ 
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
    return coursewatchhistoryData;
}

const filterCourseWatchHistoryData = async (user_id, course_id) => {

    const coursewatchhistoryData = await CourseWatchHistorySchema.findOne({ 
        $and: [
            {
                user_id: user_id
            },
            {
                course_id: course_id
            }
        ]
    }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return coursewatchhistoryData;
}

const fetchCourseWatchHistory = async (user_id, course_id, page, perPage) => {

    const coursewatchhistoryData = await CourseWatchHistorySchema.aggregate([
        {
          $match: { "course_id": course_id, "user_id" : user_id }
        },
        {
          $facet: {
            paginatedData: [
              { $unwind: "$progress" },
              {
                $skip: page 
              },
              {
                $limit: perPage
              },
              {
                $group: {
                  _id: "$_id",
                  "progress": { $push: "$progress" }
                }
              }
            ]
          }
        },
        {
          $project: {
            paginatedData: 1
          }
        }
    ]).then((data) => {
        return data?.[0]?.paginatedData?.[0] || []
    }).catch((err) => {
        return null
    });

    return coursewatchhistoryData;
}


const removeCourseWatchHistoryData = async (user_id, course_id) => {

    const coursewatchhistoryData = await CourseWatchHistorySchema.deleteOne({user_id: user_id, course_id: course_id }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return coursewatchhistoryData;
}

const updateCourseWatchHistoryData  = async (id,updateData) => {

    const userCourseResult = CourseWatchHistorySchema.findOneAndUpdate({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return userCourseResult;
}

const addCourseTopicWatchHistory = async (id, updateData) => {

    const addCourseWatchHistoryData = await CourseWatchHistorySchema.findOneAndUpdate({ _id: id }, { $push:  { "progress": updateData } }, { new: true }).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return addCourseWatchHistoryData;

}

const addCompletedChapter = async (id, chapter_id) => {

    const addCourseWatchHistoryData = await CourseWatchHistorySchema.findOneAndUpdate({ _id: id }, { $push:  { "completed_chapter": chapter_id } }, { new: true }).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return addCourseWatchHistoryData;

}

const addCompletedTopic = async (id, topic_id) => {

    const addCourseWatchHistoryData = await CourseWatchHistorySchema.findOneAndUpdate({ _id: id }, { $push:  { "completed_topics": topic_id } }, { new: true }).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return addCourseWatchHistoryData;

}

const deleteCompletedTopic = async (user_id, course_id,topic_id) => {
    const topicData = await CourseWatchHistorySchema.findOneAndUpdate({ user_id: user_id,course_id: course_id}, { $pull: { progress: { topics_id: topic_id } } }, { new: true }).then((model) => {
        return true
    }).catch((err) => {
        return false
    });
      
    return topicData;
}

const checkCompletedChapter = async (id, chapter_id) => {

    const checkCompletedChapter = await CourseWatchHistorySchema.findOne({ _id: id, completed_chapter: chapter_id }).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return checkCompletedChapter;

}

const checkCompletedTopics = async (id, topic_id) => {

    const checkCompletedTopics = await CourseWatchHistorySchema.findOne({ _id: id, completed_topics: topic_id }).then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return checkCompletedTopics;

}

const getCourseCompletionRateCourseWise = async () => {

   let data = await CourseWatchHistorySchema.aggregate([
        {
            $group: {
                _id : "$course_id" ,
                total: { $sum: 1 },
                complete: {
                    $sum: {
                        $cond: [ { $eq: [ "$is_course_completed", true ] }, 1, 0 ]
                    }
                },
                not_complete: {
                    $sum: {
                        $cond: [ { $eq: [ "$is_course_completed", false ] }, 1, 0 ]
                    }
                }
            }
        }
    ]).then((data) => {
        return data
    }).catch((err) => {
        return null
    });

    return data;
}

const getCourseCompletionRateCourseWiseInWeek = async (start_date) => {

    const userCourseCompletionRateData = await CourseWatchHistorySchema.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(start_date)
                },
                is_course_completed: {
                    $eq: true
                }
            },
        },
        {
            $project:{
                _id: {
                    course_id:  "$course_id",
                    week: {
                        $dateToString: {
                            date: "$createdAt" ,
                            format: "%Y-%m"
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id.week" ,
                course_id: { $push:  "$_id.course_id" },
                count: { $count : {}}
            }
        }
    ]).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        console.log("err", err)
        return null
    });
    return userCourseCompletionRateData;
}

const getCourseCompletionRateData = async (start_date) => {

    console.log("start_date ::: ", start_date)

    const data = await CourseWatchHistorySchema.aggregate([
        {
            $match: {
                course_completion_date: {
                    $gte: new Date(start_date)
                },
                is_course_completed: {
                    $eq: true
                }
            },
        },
        {
          $group: {
            _id: {
                $subtract: [
                  { $dayOfYear: "$course_completion_date" },
                  { $mod: [{ $dayOfYear: "$course_completion_date" }, 10] } // Group by intervals of 10 days
                ]
              },
            total: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $eq: ["$is_course_completed", true] }, 1, 0]
              }
            }
          }
        },
        {
            $sort: {
              _id: 1
            }
        },
        {
          $project: {
            _id: 1,
            rangeTitles: {
                $concat: [
                  { $dateToString: { format: "%Y-%m-%d", date: { $subtract: ["$course_completion_date", { $multiply: ["$_id", 24 * 60 * 60 * 1000] }] } } },
                  " - ",
                  { $dateToString: { format: "%Y-%m-%d", date: { $subtract: ["$course_completion_date", { $multiply: [{ $subtract: [10, "$_id"] }, 24 * 60 * 60 * 1000] }] } } }
                ]
            },
            completion_rate: {
              $multiply: [{ $divide: ["$completed", "$total"] }, 100]
            }
          }
        }
      ]).then((userData) => {
        console.log("userData ::", userData)
        return userData
    }).catch((err) => {
        console.log("err ::", err)
        return false
    });

   return data;
}


module.exports = {
    createCourseWatchHistory,
    removeCourseWatchHistoryData,
    fatchCourseWatchHistoryList,
    filterCourseWatchHistoryData,
    updateCourseWatchHistoryData,
    addCourseTopicWatchHistory,
    addCompletedChapter,
    addCompletedTopic,
    deleteCompletedTopic,
    checkCompletedChapter,
    checkCompletedTopics,
    getCourseCompletionRateCourseWise,
    getCourseCompletionRateCourseWiseInWeek,
    getCourseCompletionRateData,
    fetchCourseWatchHistory
}