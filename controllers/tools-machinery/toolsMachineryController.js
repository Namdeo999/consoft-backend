
import { Report, ToolsMachinery, ToolsMachineryReport, ToolsMachineryReportItem } from '../../models/index.js'
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
    async getTAndPReport(req, res, next) {
        let documents;
        try {
            documents = await Report.aggregate([
                {
                    $match: {
                        "project_id": ObjectId(req.params.project_id),
                        "user_id": ObjectId(req.params.user_id),
                        "report_date": req.params.date
                    }

                },
                {
                    $lookup: {
                        from: 'toolsMachineryReport',
                        localField: '_id',
                        foreignField: 'report_id',
                        as: 'toolsAndMachineryReport'
                    }
                },

                {
                    $unwind: "$toolsAndMachineryReport"
                },
                {
                    $lookup: {
                        from: "toolsMachineryReportItem",
                        let: { "equipment_report_Id": "$toolsAndMachineryReport._id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$equipment_report_Id", "$$equipment_report_Id"] }
                                }
                            },
                        ],
                        as: 'toolsAndMachineryReportItem'
                    }
                },
                {
                    $unwind: "$toolsAndMachineryReportItem"
                },
                {
                    $lookup: {
                        from: 'toolsMachineries',
                        localField: 'toolsAndMachineryReportItem.equipment_id',
                        foreignField: '_id',
                        as: 'toolsAndMachineryName'
                    }
                },
                {
                    $unwind: "$toolsAndMachineryName"
                },
                {
                    $project: {
                        _id: 1,
                        company_id: 1,
                        project_id: 1,
                        toolsAndMachineryReport: {
                            _id: 1,
                            user_id: 1,
                            report_id: 1,
                            equipment_report_date: 1,
                            equipment_report_time: 1,
                        },
                        toolsAndMachineryReportItem: {
                            _id: 1,
                            equipment_report_Id: 1,
                            equipment_id: 1,
                            qty: 1,
                            equipment_name: "$toolsAndMachineryName.tools_machinery_name",
                            onDateChange: 1,
                        }
                    }
                }
            ])

        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({ "status": 200, data: documents });
    },
    async tAndPReport(req, res, next) {

        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();

        const { report_id, user_id, equipmentField } = req;

        const report_exist = await ToolsMachineryReport.exists({ report_id: ObjectId(report_id), user_id: user_id, equipment_report_date: current_date });

        let equipment_report_Id;
        let equipment_report_exist;


        try {
            let Tools;
            if (!report_exist) {
                Tools = new ToolsMachineryReport({
                    report_id,
                    user_id,
                    equipment_report_date: current_date,
                    equipment_report_time: current_time
                });

                const result = await Tools.save();
                equipment_report_Id = result._id;
            }
            else {
                equipment_report_Id = report_exist._id;
            }
        } catch (err) {
            return next(err);
        }

        try {
            equipmentField.forEach(async (list) => {
                equipment_report_exist = await ToolsMachineryReportItem.exists({ equipment_report_Id: ObjectId(equipment_report_Id), equipment_id: list.equipment_id })
                if (equipment_report_exist) {
                    return;
                }
                const equipment_item_report = new ToolsMachineryReportItem({
                    equipment_report_Id: ObjectId(equipment_report_Id),
                    equipment_id: list.equipment_id,
                    qty: list.qty,
                    onDateChange: list.onDateChange
                })
                const res = await equipment_item_report.save();
            });
            return ({ status: 200 });
        } catch (error) {
            return next(err);
        }

    },
    async tAndPEditReport(req, res, next) {
        let document;
        try {
            document = await ToolsMachineryReportItem.findOne({ _id: req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },
    async tAndPUpdateReport(req, res, next) {
        let documents;
        const { equipmentField } = req.body;
        try {
            equipmentField.forEach(async (list) => {
                documents = await ToolsMachineryReportItem.findByIdAndUpdate(
                    { _id: req.params.id },
                    {
                        equipment_id: ObjectId(list.equipment_id),
                        qty: list.qty,
                        onDateChange: list.onDateChange
                    },
                    { new: true }
                );
            })
        } catch (error) {
            return next(error);
        }
        return res.send(CustomSuccessHandler.success("Equipment Report Updated Successfully!"));
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