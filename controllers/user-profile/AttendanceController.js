import { Attendance } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { ObjectId } from "mongodb";
import CustomFunction from "../../services/CustomFunction.js";


const AttendanceController = {

    async index(req, res, next){
        let documents; 
        try {
            documents = await Attendance.find({user_id: ObjectId(req.params.user_id)});
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ "status":200, data:documents });
    },

    async store(req, res, next){

        const { user_id, leavedays } = req.body;
        let year = CustomFunction.currentYearMonthDay('YYYY');
        const exist = await Attendance.exists({user_id: ObjectId(user_id), year:year});
        let attendance_main_id;
        try {
            if (!exist) {
                const attendance = new Attendance({
                    user_id,
                    year:year
                });
                const result = await attendance.save();
                attendance_main_id = result._id;
            }else{
                attendance_main_id = exist._id;
            }
        } catch (err) {
            return next(err);
        }
        
        let month = CustomFunction.currentYearMonthDay('MM')
        let current_date = CustomFunction.currentDate();
        let month_name = CustomFunction.monthName(); // pass 'long' in params to print long month name and default is short
       
        try {
            const month_exist = await Attendance.exists({_id: { $eq: ObjectId(attendance_main_id) }, months: { $elemMatch: { month: month}, } });

            if (!month_exist) {
                await Attendance.findByIdAndUpdate(
                    { _id: ObjectId(attendance_main_id) },
                    {
                        $push:{
                            months: {
                                month:month,
                                month_name:month_name,
                            } 
                        } 
                    },
                    { new: true }
                )
            }

            // console.log(month_exist)
        } catch (err) {
            return next(err);
        }

        let leave_day_exist;
        try {
            leavedays.forEach( async (list, key) => {
                
                
                leave_day_exist = await Attendance.find({
                    _id: { $eq: ObjectId(attendance_main_id) }, 
                    months: { 
                        $elemMatch: { month: month}, 
                    },
                    "months.leavedays.leave_date": list
                })

                if (leave_day_exist.length > 0) {
                    return;
                }

                const leaveData = await Attendance.findOneAndUpdate(
                    {
                        $and: [
                            {
                                _id: { $eq: ObjectId(attendance_main_id) },
                                months: { $elemMatch: { month: month}, }
                            }
                        ]
                    },
                    {
                        $push:{
                            "months.$.leavedays": {
                                leave_date : list,
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
        // const project_exist = await ProjectTeam.findOne({ project_id: ObjectId(project_id) }).select('_id');
    }

}

export default AttendanceController;