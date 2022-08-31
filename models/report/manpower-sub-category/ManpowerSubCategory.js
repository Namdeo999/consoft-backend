import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const manpowerSubCategorySchema = mongoose.Schema({
    company_id:{ type: ObjectId, required:true},
    manpower_category_id:{ type: ObjectId, required:true},
    manpower_sub_category:{ type: String, required:true}
});

export default mongoose.model('ManpowerSubCategory',manpowerSubCategorySchema,'manpowerSubCategories');