import mongoose from "mongoose";
import { ObjectId } from "mongodb";


const userSchema = new mongoose.Schema({
    u_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    password: { type: String},
    role_id: { type: ObjectId, required: true },
    company_id: { type: ObjectId, required: true },
    user_privilege: { type: ObjectId, required: true },
    // role: { type: String, default: 'editor' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
