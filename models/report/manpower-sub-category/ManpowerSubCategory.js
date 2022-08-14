import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const manpowerSubCategorySchema = mongoose.Schema({
    manpower_category_id:{ type: ObjectId, required:true},
    manpower_sub_category:{ type: String, required:true}
});

export default mongoose.model('ManpowerSubCategory',manpowerSubCategorySchema,'manpowerSubCategories');