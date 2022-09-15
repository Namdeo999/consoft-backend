import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { SubWorkAssign, Report, ProjectReportPath } from "../../models/index.js";
import CustomFunction from "../../services/CustomFunction.js";
import Constants from "../../constants/index.js";
import { ObjectId } from "mongodb";

const VerifyController = {
    async verifySubmitWork(req, res, next){
        try {
            const verify_date = CustomFunction.currentDate();
            const verify_time = CustomFunction.currentTime();
            const verify = await SubWorkAssign.findByIdAndUpdate(
                { _id: req.params.work_id },
                {
                    verify_date:verify_date,
                    verify_time:verify_time,
                    verify:true,
                },
                { new: true }

            ).select('-__v');

            res.send(CustomSuccessHandler.success("Verify successfully!"))
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
    },

    //report verify
    async verifyReport(req, res, next){
        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();
        let { project_id, report_id, user_id} = req.params;
        try {

            const project_path = await ProjectReportPath.findOne({project_id:project_id}).select('-createdAt -updatedAt -__v');
            if (project_path) {

                if (project_path.verification_1.toString() === user_id) {
                    const report_data = await Report.findById({_id:report_id}).select('verify_1_status');
                    if (report_data.verify_1_status === Constants.VERIFY ) {
                        return next(CustomErrorHandler.inValid('Already verified'));
                    }
                    await Report.findByIdAndUpdate(
                        {_id:report_id},
                        {
                            verify_1_status:Constants.VERIFY,
                            verify_1_date:current_date,
                            verify_1_time:current_time,
                        },
                        {new: true}
                    ).select('-__v');
                }else if (project_path.admin_1.toString() === user_id) {
                    const report_data = await Report.findById({_id:report_id}).select('admin_1_status');
                    if (report_data.admin_1_status === Constants.VERIFY ) {
                        return next(CustomErrorHandler.inValid('Already verified'));
                    }
                    await Report.findByIdAndUpdate(
                        {_id:report_id},
                        {
                            admin_1_status:Constants.VERIFY,
                            admin_1_date:current_date,
                            admin_1_time:current_time,
                        },
                        {new: true}
                    ).select('-__v');
                }else if (project_path.admin_2.toString() === user_id) {
                    const report_data = await Report.findById({_id:report_id}).select('admin_2_status');
                    if (report_data.admin_2_status === Constants.VERIFY ) {
                        return next(CustomErrorHandler.inValid('Already verified'));
                    }
                    await Report.findByIdAndUpdate(
                        {_id:report_id},
                        {
                            admin_2_status:Constants.VERIFY,
                            admin_2_date:current_date,
                            admin_2_time:current_time,
                            final_verify_status:true
                        },
                        {new: true}
                    ).select('-__v');
                }else{
                    return next(CustomErrorHandler.inValid('Out of privilege')); 
                }

            }
        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success("Verified successfully!"))
    },

}

export default VerifyController;



//--------------------


// db.projectReportPaths.aggregate(
//     {
//                     $match:{
//                       "company_id":ObjectId('62ba94b8ea988119bbf13687'),
//                       "project_id":ObjectId('62c827499c1d4cb814ead624')
//                     }
//                 },
//                 {
//                     $lookup: { 
//                         from: 'projects',
//                         let: { "project_id": '$project_id' },
//                         pipeline: [
//                             {
//                                 $match: {
//                                     $expr: { $eq: ["$_id", "$$project_id"] },
//                                 }
//                             },
//                             {
//                             $project: {
//                                     "_id": 0,
//                                     "project_name": 1
//                                 }
//                             }
//                         ],
//                         as: 'projectData'
//                     },
//                 },
//                 {$unwind:"$projectData"},
//                 {
//                     $lookup: { 
//                         from: 'users',
//                         // let: { "started_by": { "$toObjectId": "$started_by" } },
//                         let: { "started_by":  "$started_by" },
//                         pipeline: [
                          
//                             {
//                                 $match: {
//                                     $expr: { 
//                                         $and:[
                                            
//                                                 { $ne: ["$started_by" , ' ']},
//                                                 // { $eq: ["$_id", { "$toObjectId": "$$started_by" }] }
//                                                 // { $eq: ["$_id", "$$started_by" ] }
//                                                 { $eq: ["$_id", {"$toObjectId": "$$started_by"}]}
//                                             ],
//                                     },
//                                     // "users": { 
//                                     //     $exists: true,
//                                     //     $ne: [],
//                                     //   },
//                                 }
//                             },
//                             {
//                             $project: {
//                                     "_id": 0,
//                                     "name": 1
//                                 }
//                             }
//                         ],
//                         as: 'startedByData'
//                     },
//                 },
//                {$unwind:"$startedByData"}, 
//   );


// {
//     $match: {
//       $or: [
//             {
//                 $and: [
//                     {'privacy.mode': {$eq: PrivacyMode.EveryOne,},},
//                 ],
//             },
//             {
//             $and: [
//                 {'privacy.mode': {$eq: PrivacyMode.MyCircle,},},
//                 {'user.follower.id': {$eq: req.currentUser?.id,},},
//             ],
//             },
//         ],
//     },
// }


// $match: {
//     $expr: { 
//         $and:[
//               { $ifNull : [ "$started_by", [ { value : '' } ] ] }, 
//                 // { $eq: ['$started_by_status', true]},
//                 // { $eq: ['$started_by', '']},
//                 // { $eq: ["$_id", { "$toObjectId": "$$started_by" }] }
//                 { $eq: ['$_id', '$$started_by' ] }
//                 // { $eq: ['$_id', {'$toObjectId':'$$started_by'}]}
//             ],
//     },
//     // "users": { 
//     //     $exists: true,
//     //     $ne: [],
//     //   },
// }

// db.projectReportPaths.aggregate(
//     {
//           $match:{
//             "company_id":ObjectId('62ba94b8ea988119bbf13687'),
//             "project_id":ObjectId('62c827499c1d4cb814ead624')
//           }
//       },
//       {
//           $lookup: { 
//               from: 'projects',
//               let: { 'project_id': '$project_id' },
//               pipeline: [
//                   {
//                       $match: {
//                           $expr: { $eq: ['$_id', '$$project_id'] },
//                       }
//                   },
//                   {
//                   $project: {
//                           '_id': 0,
//                           'project_name': 1
//                       }
//                   }
//               ],
//               as: 'projectData'
//           },
//       },
//       {$unwind:'$projectData'},
//       {
//           $lookup: { 
//               from: 'users',
//               // let: { "started_by": { "$toObjectId": "$started_by" } },
//               let: { 'started_by':'$started_by' },
//               pipeline: [
//                   {
                    
//                         $match: {
//                             $or: [
//                                     {
//                                         $and: [
//                                             {'started_by_status': {$eq: false},},
//                                             // {'started_by': {$eq: ''}}
//                                             // { $eq: ['$started_by', '']},
//                                         ],
//                                     },
//                                     {
//                                       $and: [
//                                         // {'started_by': {$ne: ''},},
//                                           // {'privacy.mode': {$eq: PrivacyMode.MyCircle,},},
//                                           // {'started_by': { $eq: ['$_id', {'$toObjectId':'$$started_by'}]} },
//                                           // {'started_by': { $eq: '$_id',}, },
//                                         // {$eq: ['$_id', {'$toObjectId':'62c827689c1d4cb814ead866'}] }
//                                         // {'_id': {$eq: {'$toObjectId':"$$started_by"},},},
//                                         {'_id': {$eq: 'started_by',},},
//                                         // {'_id': {$eq:'ObjectId($$started_by)',},},
//                                         // { $expr : { $eq: [ '$_id' , { $toObjectId: "$$started_by" } ] } }
//                                         // { $expr : { $eq: [ '$_id' , { $toObjectId: "$$started_by" } ] } }
//                                       ],
//                                     },
//                                 ],
//                           },
//                   },
//                   {
//                     $project: {
//                           '_id': 0,
//                           'name': 1
//                       }
//                   }
//               ],
//               as: 'startedByData'
//           },
//       },
//       // {$unwind:'$startedByData'},
//       { $unwind: { 'path': "$startedByData", "preserveNullAndEmptyArrays": true }},
//       {
//       $project:{
//             _id:1,
//             company_id:1,
//             project_id:1,
//             project_name:"$projectData.project_name",
//             started_by:1,
//             started_by_name:"$startedByData.name",
//         }
//       }
// );