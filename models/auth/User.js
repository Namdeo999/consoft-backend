import mongoose from "mongoose";
import { ObjectId } from "mongodb";

//define schema

// const userSchema = new mongoose.Schema({
//     name:{type:String, required:true, trim:true},
//     email:{type:String, required:true, trim:true},
//     password:{type:String, required:true, trim:true},
//     tc:{type:Boolean, required:true}
// });

// const UserModel = mongoose.model("user", userSchema);
// export default UserModel;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true, unique: true },
    password: { type: String},
    role_id: { type: ObjectId, required: true },
    company_id: { type: ObjectId, required: true },
    // role: { type: String, default: 'editor' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
