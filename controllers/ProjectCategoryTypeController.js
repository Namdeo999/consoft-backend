import Joi from "joi";
import { ProjectCategoryType } from "../models/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";

const ProjectCategoryTypeController = {
    async index(req, res, next){
        let documents;
        try {
            documents = await ProjectCategoryType.find().select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
}


export default ProjectCategoryTypeController;