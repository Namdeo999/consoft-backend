import { ChecklistOption } from "../../models/index.js";
import { checklistOptionSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const ChecklistOptionController = {
    async index(req, res, next){
        let documents;
        try {
            documents = await ChecklistOption.find().select('-createdAt -updatedAt -__v');
        } catch (err) { 
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async store(req, res, next){
        const { error } = checklistOptionSchema.validate(req.body);
        if(error){
            return next(error);
        }

        try {
            const exist = await ChecklistOption.exists({checklist_option: req.body.checklist_option});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('Checklist option already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const {option_type_id, checklist_option} = req.body;
        const document = new ChecklistOption({
            option_type_id,
            checklist_option,
        });

        try {
            const result = await document.save();
            res.send(CustomSuccessHandler.success('Checklist option created successfully'));
        } catch (err) {
            return next(err);
        }
    },

    async edit(req, res, next){
        let document;
        try {
            document = await ChecklistOption.findOne({_id: req.params.id}).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(document);
    },

    async update(req, res, next){
        const {error} = checklistOptionSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {option_type_id, checklist_option} = req.body;
        let document;
        try {
            document = await ChecklistOption.findByIdAndUpdate(
                { _id:req.params.id },
                { option_type_id, checklist_option },
                { new : true },
            ).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
    },

    async destroy(req, res, next){
        const document = await ChecklistOption.findByIdAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'))
        }
        return res.json(document);
    },

}

export default ChecklistOptionController;