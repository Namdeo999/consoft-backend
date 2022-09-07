import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";
import { APP_URL } from "../../config/index.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const waterLevelSchema = mongoose.Schema({
    led_status:{ type: Number },
    water_level:{ type: Number },
    image:{ type: String }
    // image:{ type: String , get:(image) => {
    //         // return `${APP_URL}/${image}`;
    //         return `${image}`;
    //     }
    // },
}, {timestamps:true});
// }, {timestamps:true, toJSON: { getters: true }, id: false});

export default mongoose.model('WaterLevel', waterLevelSchema, 'waterLevels');