import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const userRoleSchema = mongoose.Schema({
    company_id: {type: ObjectId, required: true},
    user_role: {type: String, required: true, unique: true },
}, { timestamps: true } );

export default mongoose.model('UserRole', userRoleSchema, 'userRoles' ); 