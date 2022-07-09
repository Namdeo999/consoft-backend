import mongoose from "mongoose";

const companySchema = mongoose.Schema({
    company_name: {type: String, required:true},
    //pan: {type:String, required:true },
    mobile: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'Administrator' },
})

export default mongoose.model('Company', companySchema, 'companies');