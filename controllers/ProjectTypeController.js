import Joi from "joi";
import { ProjectType } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";

const ProjectTypeController = {

    async index(req, res, next){
        let documents;
        try {
            documents = await ProjectType.find().select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async store(req, res, next){

        const projectTypeSchema = Joi.object({
            category_id:Joi.string().required(),
            project_type:Joi.string().required(),
        });

        const {error} = projectTypeSchema.validate(req.body);
        if(error){
            return next(error);
        }

        try {
            const exist = await ProjectType.exists({project_type:req.body.project_type});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('Project type is already axist'));
            }
        } catch (err) {
            return next(err);
        }

        const {category_id, project_type} = req.body;
        const projectType = new ProjectType({
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

        return res.json(document);
    },

    async update(req, res, next){
        const projectTypeSchema = Joi.object({
            category_id:Joi.string().required(),
            project_type:Joi.string().required(),
        });

        const {error} = projectTypeSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {category_id, project_type} = req.body;
        let document;
        try {
            document = await ProjectType.findOneAndUpdate(
                { _id: req.params.id},
                {
                    category_id,
                    project_type,
                },
                {new: true}
            );
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
    },

    async destroy(req, res, next) {
        const document = await ProjectType.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    },


}


export default ProjectTypeController;