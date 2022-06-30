import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const projectCategorySchema = mongoose.Schema({
    company_id: {type: ObjectId, required: true },
    category_name: {type: String, required: true, unique: true },
}, { timestamps: true } );

export default mongoose.model('ProjectCategory', projectCategorySchema, 'projectCategories' ); 

