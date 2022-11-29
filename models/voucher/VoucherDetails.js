import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const voucherDetailsSchema = mongoose.Schema({
    voucher_id: {type: ObjectId, required:true},
    item_id:{type:ObjectId,required:true},
    unit_id:{type:ObjectId,required:true},
    qty:{type:Number,required:true},
    voucher_type: { type: String, required: true },
    verify_status:{type:Boolean,default:true},
    revert_status:{type:Boolean,default:false},
    vehicle_no:{type:String},
    location:{type:String},
    remark:{type:String}    
})

export default mongoose.model('VoucherDetails', voucherDetailsSchema, 'voucherDetails');