import { Attendance } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { ObjectId } from "mongodb";


const AttendanceController = {

    async store(req, res, next){

        const { user_id, year, month, present_date, in_time, out_time } = req.body;
        const exist = await Attendance.exists({user_id: ObjectId(user_id), year:year});
        console.log(exist);

        // const project_exist = await ProjectTeam.findOne({ project_id: ObjectId(project_id) }).select('_id');
    }

}

export default AttendanceController;