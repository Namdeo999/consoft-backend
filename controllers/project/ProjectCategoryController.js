import Joi from "joi";
import { ProjectCategory } from "../../models/index.js";
import { projectCategorySchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const ProjectCategoryController = {

    async index(req, res, next){
        let documents;
        try {
            documents = await ProjectCategory.find().select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async store(req, res, next){
        
        const {error} = projectCategorySchema.validate(req.body);
        if(error){
            return next(error);
        }

        try {
            const exist = await ProjectCategory.exists({category_name:req.body.category_name});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This category is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const {company_id, category_name} = req.body;
        const project_category = new ProjectCategory({
            company_id,
            category_name,
        });

        try {
            const result = await project_category.save();
            res.send(CustomSuccessHandler.success('Category created successfully'));
        } catch (err) {
            return next(err);
        }

    },

    async edit(req, res, next){
        let document;
        try {
            document = await ProjectCategory.findOne({ _id:req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({"status":200, document});
    },

    async update(req, res, next){
        
        const {error} = projectCategorySchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {company_id, category_name} = req.body;
        let document;
        try {
            document = await ProjectCategory.findOneAndUpdate({ _id: req.params.id},{company_id, category_name},{new: true});
        } catch (err) {
            return next(err);
        }
        // res.status(201).json(document);
        return res.send(CustomSuccessHandler.success("Category updated successfully"))
    },

    async destroy(req, res, next) {
        const document = await ProjectCategory.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // return res.send({"status":200,"message": "Category deleted successfully" })
        return res.send(CustomSuccessHandler.success("Category deleted successfully"))
    },
    

}


export default ProjectCategoryController;