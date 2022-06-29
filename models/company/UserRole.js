import mongoose from "mongoose";

const userRoleSchema = mongoose.Schema({
    user_role: {type: String, required: true, unique: true },
}, { timestamps: true } );

export default mongoose.model('UserRole', userRoleSchema, 'userRoles' ); 