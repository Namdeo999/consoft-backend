import Joi from "joi";
import { Project } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";


const ProjectController = {
    
    async addProject(req, res, next){
        const projectSchema = Joi.object({
            project_name: Joi.string().min(5).max(50).required(),
            project_location: Joi.string().required(),
            plot_area: Joi.number().required(),
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

        const {project_name, project_location, plot_area} = req.body;
        const project = new Project({
            project_name:project_name,
            project_location:project_location,
            plot_area:plot_area,
        }) ;

        try {
            const result = await project.save();
            // res.status(200).send({ "status": "success", "message": "Project created" })
            res.send(CustomSuccessHandler.success('Project created successfully'));
        } catch (err) {
            return next(err);
        }
    }


}

export default ProjectController ;