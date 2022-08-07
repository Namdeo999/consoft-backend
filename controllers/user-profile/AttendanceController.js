import { Attendance } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { ObjectId } from "mongodb";
import CustomFunction from "../../services/CustomFunction.js";


const AttendanceController = {

    async index(req, res, next){
        let documents; 
        try {
            documents = await Attendance.find({user_id: req.params.user_id});
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ "status":200, data:documents });
    },

    async getLeaves(req, res, next){
        let documents; 
        try {
            documents = await Attendance.aggregate([
                // {
                //     $match: { 
                //         $and:[
                //             {"user_id": ObjectId(req.params.user_id)}
                //         ]
                //     },
                // },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userData'
                    },
                },
                {
                    $unwind:"$userData"
                },
                {
                    $project:{
                        _id:1,
                        user_id:1,
                        user_name:"$userData.name",
                        // year:1,
                        // months:{
                        //     // month:1,
                        //     month_name:1,
                        //     // _id:1,
                        // },
                        // "months.presentdays":{},
                        "presentdates": {$ifNull: ["$presentdates", []]},
                        "leavedates":{
                            _id:1,
                            leave_date:1,
                            approved:1,
                        }
                    }
                }
            ]);
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ "status":200, data:documents });
    },

    async applyLeaves(req, res, next){
        const { user_id, leavedates } = req.body;
        let year = CustomFunction.currentYearMonthDay('YYYY');
        let month = CustomFunction.currentYearMonthDay('MM')
        let month_name = CustomFunction.monthName();
        let attendance_main_id;

        const exist = await Attendance.exists({user_id: ObjectId(user_id), year:year, month:month});
        try {
            if (!exist) {
                const attendance = new Attendance({
                    user_id,
                    year:year,
                    month:month,
                    month_name:month_name,
                });
                const result = await attendance.save();
                attendance_main_id = result._id;
            }else{
                attendance_main_id = exist._id;
            }
        } catch (err) {
            return next(err);
        }

        if (leavedates) {
            console.log("if")
        }else{
            console.log("else")
        }

        let leave_date_exist;
        try {
            leavedates.forEach( async (list, key) => {
                leave_date_exist = await Attendance.find({
                    _id: attendance_main_id , 
                    "leavedates.leave_date": list.leave_date
                })
                if (leave_date_exist.length > 0) {
                    return;
                }
                const leaveData = await Attendance.findByIdAndUpdate(
                    {_id: attendance_main_id},
                    {
                        $push:{
                            "leavedates": {
                                leave_date : list.leave_date,
                            }
                        }
                    },
                    { new: true }
                );
            })
        } catch (err) {
            return next(err)
        }

        res.send(CustomSuccessHandler.success('Leave apply successfully'));
    },

    // async newstore(req, res, next){

    //     const { user_id, leavedays } = req.body;
    //     let year = CustomFunction.currentYearMonthDay('YYYY');
    //     const exist = await Attendance.exists({user_id: ObjectId(user_id), year:year});
    //     let attendance_main_id;
    //     try {
    //         if (!exist) {
    //             const attendance = new Attendance({
    //                 user_id,
    //                 year:year
    //             });
    //             const result = await attendance.save();
    //             attendance_main_id = result._id;
    //         }else{
    //             attendance_main_id = exist._id;
    //         }
    //     } catch (err) {
    //         return next(err);
    //     }
        
    //     let month = CustomFunction.currentYearMonthDay('MM')
    //     let current_date = CustomFunction.currentDate();
    //     let month_name = CustomFunction.monthName(); // pass 'long' in params to print long month name and default is short
       
    //     try {
    //         const month_exist = await Attendance.exists({_id: { $eq: ObjectId(attendance_main_id) }, months: { $elemMatch: { month: month}, } });

    //         if (!month_exist) {
    //             await Attendance.findByIdAndUpdate(
    //                 { _id: ObjectId(attendance_main_id) },
    //                 {
    //                     $push:{
    //                         months: {
    //                             month:month,
    //                             month_name:month_name,
    //                         } 
    //                     } 
    //                 },
    //                 { new: true }
    //             )
    //         }

    //         // console.log(month_exist)
    //     } catch (err) {
    //         return next(err);
    //     }

    //     let leave_day_exist;
    //     try {
    //         leavedays.forEach( async (list, key) => {
                
                
    //             leave_day_exist = await Attendance.find({
    //                 _id: { $eq: ObjectId(attendance_main_id) }, 
    //                 months: { 
    //                     $elemMatch: { month: month}, 
    //                 },
    //                 "months.leavedays.leave_date": list
    //             })

    //             if (leave_day_exist.length > 0) {
    //                 return;
    //             }

    //             const leaveData = await Attendance.findOneAndUpdate(
    //                 {
    //                     $and: [
    //                         {
    //                             _id: { $eq: ObjectId(attendance_main_id) },
    //                             months: { $elemMatch: { month: month}, }
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     $push:{
    //                         "months.$.leavedays": {
    //                             leave_date : list,
    //                         }
    //                     }
    //                 },
    //                 { new: true }
    //             );

    //         })

    //     } catch (err) {
    //         return next(err)
    //     }

    //     res.send(CustomSuccessHandler.success('Leave apply successfully'));
    //     // const project_exist = await ProjectTeam.findOne({ project_id: ObjectId(project_id) }).select('_id');
    // },

    async approveLeaves(req, res, next){
        try {
            const {leavedates}  = req.body;
            leavedates.forEach( async (list, key) => {
                await Attendance.findOneAndUpdate(
                    {
                        _id: req.params.id, "leavedates._id": list.leave_date_id
                    },
                    {
                        $set: 
                        { 
                            "leavedates.$.approved" : true 
                        }
                    },
                );
            })
            res.send(CustomSuccessHandler.success("Leave Approved successfully!"))
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
    }

}

export default AttendanceController;