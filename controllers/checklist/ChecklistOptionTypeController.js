import { ChecklistOptionType } from '../../models/index.js';
import { checklistOptionTypeSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const ChecklistOptionTypeController = {
    async index(req, res, next){
        let documents;
        try {
            documents = await ChecklistOptionType.find({company_id:req.company._id}).select('-createdAt -updatedAt -__v');
        } catch (err) { 
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async store(req, res, next){
        const { error } = checklistOptionTypeSchema.validate(req.body);
        if(error){
            return next(error);
        }

        try {
            const exist = await ChecklistOptionType.exists({option_type: req.body.option_type});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This option type already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const {company_id, option_type} = req.body;
        const document = new ChecklistOptionType({
            company_id,
            option_type,
        });

        try {
            const result = await document.save();
            res.send(CustomSuccessHandler.success('Checklist option type created successfully'));
        } catch (err) {
            return next(err);
        }

    },

    async edit(req, res, next){
        let document;
        try {
            document = await ChecklistOptionType.findOne({_id: req.params.id}).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document);
    },

    async update(req, res, next){
        const {error} = checklistOptionTypeSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {company_id, option_type} = req.body;
        let document;
        try {
            document = await ChecklistOptionType.findByIdAndUpdate(
                { _id:req.params.id },
                { company_id, option_type },
                { new : true },
            ).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
    },

    async destroy(req, res, next){
        const document = await ChecklistOptionType.findByIdAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'))
        }
        return res.json(document);
    },

}

export default ChecklistOptionTypeController;