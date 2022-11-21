import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const voucherDetailsSchema = mongoose.Schema({
    voucher_id: {type: ObjectId, required:true},
    item_id:{type:String,required:true},
    qty:{type:Number,required:true},
    vehicle_no:{type:String},
    location:{type:String},
    remark:{type:String}    
})

export default mongoose.model('VoucherDetails', voucherDetailsSchema, 'voucherDetails');