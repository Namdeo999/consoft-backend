import mongoose from "mongoose";

const userPrivilegeSchema = mongoose.Schema({
    privilege:{type: String, required:true, unique:true}
});

export default mongoose.model('UserPrivilege',userPrivilegeSchema,'userPrivileges');