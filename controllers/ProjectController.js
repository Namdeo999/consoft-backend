import Joi from "joi";
import { Project } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";


const ProjectController = {

    async index(req, res, next){
        let Projects;
        try {
            Projects = await Project.find().select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(Projects);
    },

    async store(req, res, next){
        const projectSchema = Joi.object({
            project_name: Joi.string().min(5).max(50).required(),
            project_location: Joi.string().required(),
            plot_area: Joi.number().required(),
            project_type: Joi.string().required(),
        });

        const {error} = projectSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try {
            const exist = await Project.exists({project_name:req.body.project_name});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This Project is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const {project_name, project_location, plot_area, project_type} = req.body;
        const project = new Project({
            project_name:project_name,
            project_location:project_location,
            plot_area:plot_area,
            project_type:project_type,
        }) ;

        try {
            const result = await project.save();
            // res.status(200).send({ "status": "success", "message": "Project created" })
            res.send(CustomSuccessHandler.success('Project created successfully'));
        } catch (err) {
            return next(err);
        }
    },

    async edit(req, res, next){
        let document;
        try {
            document = await Project.findOne({ _id:req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },

    async update(req, res, next){
        const projectSchema = Joi.object({
            project_name: Joi.string().min(5).max(50).required(),
            project_location: Joi.string().required(),
            plot_area: Joi.number().required(),
            project_type: Joi.string().required(),
        });

        const {error} = projectSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {project_name, project_location, plot_area, project_type} = req.body;
        let document ;
        try {
            document = await Project.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    project_name,
                    project_location,
                    plot_area,
                    project_type
                },
                {new : true},
            ).select('-createdAt -updatedAt -__v');
        } catch (err) { 
            return next(err);
        }
        res.status(201).json(document);
    },

    async destroy(req, res, next) {
        const document = await Project.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    },


}

export default ProjectController ;