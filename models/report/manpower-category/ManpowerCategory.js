import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const manpowerCategorySchema = mongoose.Schema({
    company_id : { type:ObjectId, required:true },
    manpower_category : { type:String, required:true }
});

export default mongoose.model('ManpowerCategory', manpowerCategorySchema , 'manpowerCategories')