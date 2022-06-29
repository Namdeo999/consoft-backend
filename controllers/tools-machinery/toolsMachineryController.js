
import { ToolsMachinery } from '../../models/index.js'
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import ToolsMachinerySchema from '../../validators/checklist/ChecklistOptionValidator.js'
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const ToolsMachineryController = {
    async index(req, res, next) {
        let Tools;
        try {
            Tools = await ToolsMachinery.find().select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(Tools);
    },

    async store(req, res, next) {

        const { tools_machinery_name } = req.body;

        const ToolsMachine = new ToolsMachinery({
            tools_machinery_name
        });

        const ToolsMachinery_result = await ToolsMachine.save();


        try {
            res.send(CustomSuccessHandler.success("submitted successfully!"))
        } catch (error) {
            return next(error)
        }

    },
    async edit(req, res, next) {
        let document;
        try {
            document = await ToolsMachinery.findOne({ _id: req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },
    async update(req, res, next) {
        const { tools_machinery_name } = req.body;

        let document;
        try {
            document = await ToolsMachinery.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    tools_machinery_name
                },
                { new: true },
            ).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
    },

    async destroy(req, res, next) {
        const document = await ToolsMachinery.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    },
}

export default ToolsMachineryController; 