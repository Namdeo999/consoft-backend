import { ProjectType } from "../../models/index.js";
import { projectTypeSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const ProjectTypeController = {

    async index(req, res, next){
        let documents;
        try {
            documents = await ProjectType.find({company_id:req.params.company_id}).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({"status":200, data:documents});
    },

    async getProjectTypeByCategory(req, res, next){
        let documents;
        try {
            documents = await ProjectType.find({category_id:req.params.category_id}).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({"status":200, data:documents});
    },

    async store(req, res, next){

        const {error} = projectTypeSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {company_id, category_id, project_type} = req.body;
        try {
            const exist = await ProjectType.exists({company_id:company_id, project_type:project_type});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('Project type is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const projectType = new ProjectType({
            company_id,
            category_id,
            project_type,
        });

        try {
            const result = await projectType.save();
            res.send(CustomSuccessHandler.success('Project type created successfully'));
        } catch (err) {
            return next(err);
        }

    },

    async edit(req, res, next){
        let document;
        try {
            document = await ProjectType.findOne({ _id:req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({"status":200, document});
    },

    async update(req, res, next){
        
        const {error} = projectTypeSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {company_id, category_id, project_type} = req.body;
        try {
            const exist = await ProjectType.exists({company_id:company_id, project_type:project_type});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('Project type is already exist'));
            }
            const document = await ProjectType.findOneAndUpdate(
                { _id: req.params.id},
                {
                    company_id,
                    category_id,
                    project_type,
                },
                {new: true}
            );
        } catch (err) {
            return next(err);
        }
        // res.status(201).json(document);
        return res.send(CustomSuccessHandler.success("Project type updated successfully"))
    },

    async destroy(req, res, next) {
        const document = await ProjectType.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // return res.json(document);
        return res.send(CustomSuccessHandler.success("Project type deleted successfully"))
    },


}


export default ProjectTypeController;