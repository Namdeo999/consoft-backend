import { Project, ProjectTeam } from "../../models/index.js";
import { projectSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";


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

        const {company_id, project_name, project_location,project_category,project_type,project_area,project_measurement} = req.body;
        const project = new Project({
            company_id:company_id,
            project_name:project_name,
            project_location:project_location,
            project_category:project_category,
            project_type:project_type,
            project_area:project_area,
            project_measurement:project_measurement,
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
        
        const {error} = projectSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {company_id, project_name, project_location,project_category,project_type,project_area,project_measurement} = req.body;
        let document ;
        try {
            document = await Project.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    company_id,
                    project_name,
                    project_location,
                    project_category,
                    project_type,
                    project_area,
                    project_measurement
                },
                {new : true},
            ).select('-createdAt -updatedAt -__v');
        } catch (err) { 
            return next(err);
        }
        res.json({status:200, data:document});
    },

    async destroy(req, res, next) {
        const document = await Project.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    },

    async userByProjects(req, res, next){
        let projects;
        try {
            projects = await ProjectTeam.find({"$users.user_id":req.params.user_id});
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(projects);
    }


}

export default ProjectController ;