import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const waterSettingSchema = mongoose.Schema({
    water_level_id:{ type: ObjectId, required:true, unique:true },
    start_level:{ type: Number, default:0 },
    stop_level:{ type: Number, default:0 },
});

export default mongoose.model('WaterSetting', waterSettingSchema, 'waterSettings');