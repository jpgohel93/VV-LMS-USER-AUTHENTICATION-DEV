const { UserActivitySchema } = require('../schema');

const createUserActivity = async (insertData) => {

    const useractivity = new UserActivitySchema(insertData)

    const useractivityResult = await useractivity.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return useractivityResult;
}

const updateUserActivity = async (id,updateData) => {

    const useractivityResult =  await UserActivitySchema.updateOne({_id: id}, updateData).then((model) => {
        return true
    }).catch((err) => {
        return false
    });

   return useractivityResult;
}

const dailyLearningInWeek = async (start_date, course_id, user_id) => {

    const pipeline = [
        {
            $match: {
              createdAt: {
                  $gte: new Date(start_date)
              },
              module: "course",
              reference_id: course_id,
              user_id: user_id
            }
        },
        {
          $project: {
            createdAt: '$createdAt',
            timeDifference: {
              $subtract: ['$end_time', '$start_time']
            }
          }
        },
        {
          $group: {
            _id: { 
              $dateToString: {
                  date: "$createdAt" ,
                  format: "%w"
              }
            },
            total: {
              $sum: '$timeDifference'
            }
          }
        }
      ];
  
    const result = await UserActivitySchema.aggregate(pipeline).then((model) => {
        return model
    }).catch((err) => {
      console.log("err ::: ", err)
        return false
    });

   return result;
}

const timeSpendByModule = async (user_id) => {

  const pipeline = [
      {
          $match: {
            user_id: user_id
          }
      },
      {
        $project: {
          module: '$module',
          timeDifference: {
            $subtract: ['$end_time', '$start_time']
          }
        }
      },
      {
        $group: {
          _id: "$module",
          total: {
            $sum: '$timeDifference'
          }
        }
      }
    ];

  const result = await UserActivitySchema.aggregate(pipeline).then((model) => {
      return model
  }).catch((err) => {
    console.log("err ::: ", err)
      return false
  });

 return result;
}

const subjectTimeSpend = async (user_id, chapter_id) => {

  const pipeline = [
      {
          $match: {
            module: "chapter",
            reference_id: { $in : chapter_id},
            user_id: user_id
          }
      },
      {
        $project: {
          timeDifference: {
            $subtract: ['$end_time', '$start_time']
          }
        }
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: '$timeDifference'
          }
        }
      }
    ];

  const result = await UserActivitySchema.aggregate(pipeline).then((model) => {
      return model
  }).catch((err) => {
    console.log("err ::: ", err)
      return false
  });

 return result;
}

module.exports = {
    createUserActivity,
    updateUserActivity,
    dailyLearningInWeek,
    timeSpendByModule,
    subjectTimeSpend
}