db.Zendata.insertMany([
  
    [
       {
          "user_id": 1,
          "name": "vijay",
          "email": "xxx@gmail.com"
       },
       {
          "user_id": 2,
          "name": "surya",
          "email": "xyx@gmail.com"
       },
       {
          "user_id": 3,
          "name": "vipin",
          "email": "yyy@gmail.com"
       }
    ],
  
    [
       {
          "user_id": 1,
          "codekata_id": 1,
          "problemsolved": 60
       },
       {
          "user_id": 2,
          "codekata_id": 2,
          "problemsolved": 50
       },
       {
          "user_id": 3,
          "codekata_id": 3,
          "problemsolved": 80
       }
    ],
  
    [
       {
          "user_id": 1,
          "attendance_id": 1,
          "date": "2020-10-14",
          "status": "Present"
       },
       {
          "user_id": 2,
          "attendance_id": 1,
          "date": "2020-10-14",
          "status": "Present"
       },
       {
          "user_id": 3,
          "attendance_id": 1,
          "date": "2020-10-14",
          "status": "Absent"
       }
    ],

    [
       {
          "topic_id": 1,
          "name": "React"
       },
       {
          "topic_id": 2,
          "name": "mongodb"
       },
       {
          "topic_id": 3,
          "name": "nodejs"
       }
    ],
 
    [
       {
          "task_id": 2,
          "user_id": 2,
          "topic_id": 2,
          "submission_date": "2020-10-15"
       },
       {
          "task_id": 3,
          "user_id": 3,
          "topic_id": 3,
          "submission_date": "2020-10-15"
       }
    ],

    [
       {
          "drive_id": 1,
          "date": "2020-10-20",
          "participants": [1, 2]
       },
       {
          "drive_id": 2,
          "date": "2020-10-22",
          "participants": [2, 3]
       },
       {
          "drive_id": 3,
          "date": "2020-10-22",
          "participants": [4, 3]
       }
    ],
 
    [
       {
          "mentor_id": 1,
          "name": "samjay",
          "mentee_count": 18
       },
       {
          "mentor_id": 2,
          "name": "chandrasekar",
          "mentee_count": 12
       },
       {
          "mentor_id": 3,
          "name": "thirupati",
          "mentee_count": 20
       }
    ]
 ]);
 
//1
 db.Zendata.find().aggregate([
    {
       $lookup: {
          from: "topics",
          localField: "topic_id",
          foreignField: "topic_id",
          as: "task_topic"
       }
    },
    {
       $match: {
          "submission_date": {
             $gte: ISODate("2020-10-01T00:00:00.000Z"),
             $lt: ISODate("2020-11-01T00:00:00.000Z")
          }
       }
    },
    {
       $project: {
          "task_topic.name": 1,
          "submission_date": 1
       }
    }
 ])
 //2
 db.Zendata.find({
    "date": {
       $gte: ISODate("2020-10-15T00:00:00.000Z"),
       $lte: ISODate("2020-10-31T23:59:59.999Z")
    }
 })

 //5
 db.Zendata.find({
    "mentee_count": { $gt: 15 }
 })
 //3
 db.Zendata.aggregate([
    {
      $unwind: "$4" 
    },
    {
      $lookup: {
        from: "0",
        localField: "4.participants",
        foreignField: "user_id",
        as: "participantsInfo"
      }
    },
    {
      $project: {
        "drive_id": "$4.drive_id",
        "drive_date": "$4.date",
        "participants": "$participantsInfo"
      }
    }
  ])
  

//6
 db.Zendata.aggregate([
    {
       $match: {
          "date": {
             $gte: ISODate("2020-10-15T00:00:00.000Z"),
             $lte: ISODate("2020-10-31T23:59:59.999Z")
          },
          "status": "Absent"
       }
    },
    {
       $lookup: {
          from: "tasks",
          localField: "user_id",
          foreignField: "user_id",
          as: "user_tasks"
       }
    },
    {
       $match: {
          "user_tasks": { $eq: [] } 
       }
    },
    {
       $group: {
          _id: null,
          count: { $sum: 1 }
       }
    }
 ])
 //4
 db.Zendata.aggregate([
    {
      $unwind: "$1" 
    },
    {
      $group: {
        _id: "$1.user_id",
        totalProblemsSolved: { $sum: "$1.problemsolved" }
      }
    },
    {
      $lookup: {
        from: "0", 
        localField: "_id",
        foreignField: "user_id",
        as: "userInfo"
      }
    },
    {
      $project: {
        "user_id": "$_id",
        "user_name": "$userInfo.name",
        "totalProblemsSolved": 1,
        _id: 0
      }
    }
  ])
  
 

 
 