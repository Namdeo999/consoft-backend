import { ObjectId } from "mongodb";
import mongoose from "mongoose";
// import CustomFunction from "../../services/CustomFunction.js";

// const date = CustomFunction.currentDate();
// const time = CustomFunction.currentTime();

const reportSchema = mongoose.Schema({
    project_id:{ type: ObjectId, required:true },
    user_id:{ type:ObjectId, required:true },
});

export default mongoose.model('Report', reportSchema, 'reports');