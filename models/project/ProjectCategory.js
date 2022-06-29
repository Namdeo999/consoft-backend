import mongoose from "mongoose";

const projectCategorySchema = mongoose.Schema({
    category_name: {type: String, required: true, unique: true },
}, { timestamps: true } );

export default mongoose.model('ProjectCategory', projectCategorySchema, 'projectCategories' ); 

