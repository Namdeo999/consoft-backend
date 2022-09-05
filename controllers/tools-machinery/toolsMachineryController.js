
import { Report, ToolsMachinery, ToolsMachineryReport } from '../../models/index.js'
import { toolsMachinerySchema } from '../../validators/index.js';
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from '../../services/CustomFunction.js';
import { ObjectId } from "mongodb";

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

        const { error } = toolsMachinerySchema.validate(req.body)
        if (error) {
            return next(error);
        }
        try {
            const company_exist = await ToolsMachinery.exists({ company_id: req.body.company_id });
            if (company_exist) {
                const machinery_name_exist = await ToolsMachinery.exists({ tools_machinery_name: req.body.tools_machinery_name });
                if (machinery_name_exist) {
                    return next(CustomErrorHandler.alreadyExist('This machinery is already exist'));
                }
            }
        } catch (err) {
            return next(err);
        }

        const { company_id, tools_machinery_name, qty } = req.body;

        const ToolsMachine = new ToolsMachinery({
            company_id,
            tools_machinery_name,
            qty
        });

        const result = await ToolsMachine.save();
        try {
            res.send(CustomSuccessHandler.success("Tools and machinery created successfully!"))
        } catch (error) {
            return next(error)
        }

    },
    async tAndPReport(req, res, next) {
                 
        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();

        const { report_id, user_id, equipmentField } = req;        
        
        const report_exist = await ToolsMachineryReport.exists({ report_id: ObjectId(report_id), user_id: user_id, equipment_report_date: current_date });
        // console.log("🚀 ~ file: toolsMachineryController.js ~ line 62 ~ tAndPReport ~ report_exist", report_exist)

        try {
            let Tools;

            if (!report_exist) {                
                equipmentField.forEach(list => {
                    Tools = new ToolsMachineryReport({
                        report_id,
                        user_id,
                        equipment_id: list.equipment_id,
                        qty: list.qty,
                        onDateChange: list.onDateChange,
                        equipment_report_date:current_date,
                        equipment_report_time:current_time
                    });
                });
                Tools.save();
                return ({ status: 200 });

            }
        } catch (err) {
            return next(err);
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
        const { error } = toolsMachinerySchema.validate(req.body)
        if (error) {
            return next(error);
        }
        const { company_id, tools_machinery_name, qty } = req.body;

        let document;
        try {
            document = await ToolsMachinery.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    company_id,
                    tools_machinery_name,
                    qty
                },
                { new: true },
            ).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(err);
        }
        // res.status(201).json(document);
        return res.send(CustomSuccessHandler.success("Tools and machinery updated successfully"))
    },

    async destroy(req, res, next) {
        const document = await ToolsMachinery.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(CustomSuccessHandler.success("Tools and machinery deleted successfully"));
    },
}

export default ToolsMachineryController; 