import { ManpowerSubCategory } from "../../../models/index.js";
import { manpowerSubCategorySchema } from "../../../validators/index.js";
import CustomErrorHandler from "../../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../../services/CustomSuccessHandler.js";
import CustomFunction from "../../../services/CustomFunction.js";

const ManpowerSubCategoryController = { 
    async index(req, res, next){
        let documents;
        try {
            documents = await ManpowerSubCategory.find({manpower_category_id:req.params.manpower_category_id}).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async store(req, res, next){
        const {error} = manpowerSubCategorySchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {manpower_category_id, manpower_sub_category} = req.body;
        try {
            const exist = await ManpowerSubCategory.exists({manpower_category_id:manpower_category_id, manpower_sub_category:manpower_sub_category});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist(CustomFunction.capitalize(`${manpower_sub_category} is already exist`)));
            }
        } catch (err) {
            return next(err);
        }

        const sub_category = new ManpowerSubCategory({
            manpower_category_id,
            manpower_sub_category,
        });

        try {
            const result = await sub_category.save();
            res.send(CustomSuccessHandler.success('Manpower sub category created successfully'));
        } catch (err) {
            return next(err);
        }
    },

    async edit(req, res, next){
        let document;
        try {
            document = await ManpowerSubCategory.findOne({ _id:req.params.id }).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ status:200, data:document});
    },

    async update(req, res, next){
        const {error} = manpowerSubCategorySchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {manpower_category_id, manpower_sub_category} = req.body;
        let document;
        try {
            const exist = await ManpowerSubCategory.exists({manpower_category_id:manpower_category_id, manpower_sub_category:manpower_sub_category});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist(CustomFunction.capitalize(`${manpower_sub_category} is already exist`)));
            }
            document = await ManpowerSubCategory.findByIdAndUpdate(
                { _id: req.params.id},
                {
                    manpower_category_id, 
                    manpower_sub_category
                },
                {new: true}
            );
        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success( CustomFunction.capitalize(`${manpower_sub_category} updated successfully`)));
    },
    
    async destroy(req, res, next){
        const document = await ManpowerSubCategory.findByIdAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.send(CustomSuccessHandler.success(CustomFunction.capitalize(`${document.manpower_sub_category} deleted successfully`) ))
    },

}

export default ManpowerSubCategoryController;