import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import CustomFunction from "../../services/CustomFunction.js";

const date = CustomFunction.currentDate();
const time = CustomFunction.currentTime();

const VoucherSchema = mongoose.Schema({
  company_id: { type: ObjectId, required: true },
  project_id: { type: ObjectId, required: true },
  // verify_status:{type:Boolean,default:true},
  voucher_date: { type: String, default: date },
  voucher_time: { type: String, default: time },
});

export default mongoose.model("Voucher", VoucherSchema, "vouchers");
