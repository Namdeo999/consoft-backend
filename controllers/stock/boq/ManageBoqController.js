import Joi from "joi";
import { ManageBoq } from "../../../models/index.js";
import { manageBoqSchema } from "../../../validators/index.js";
import CustomErrorHandler from "../../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../../services/CustomSuccessHandler.js";
import { ObjectId } from "mongodb";

const ManageBoqController = {
    async index(req, res, next) {
        let documents;
        let condition;

        try {
            if ( req.params.project_id ) {
                condition = {"company_id": ObjectId(req.params.company_id),"project_id": ObjectId(req.params.project_id)}
            }else{
                condition = {"company_id": ObjectId(req.params.company_id)}
            }
            documents = await ManageBoq.aggregate([
                {
                    $match: { 
                        $and:[
                            condition
                        ]
                    },
                     
                    // $match:{
                    //     $and:[
                    //         {
                    //             $or: [
                    //                 { "company_id": ObjectId(req.params.company_id) },
                    //                 { "project_id": ObjectId(req.params.project_id) },
                                    
                    //             ]
                    //         },
                    //         { "company_id": ObjectId(req.params.company_id) },
                    //         // {"work_status":false},
                    //         // {"verify":false},
                            
                    //     ]
                    // }

                },

                {
                    $addFields: {
                        boqitems: {
                            $map: {
                                input: "$boqitems",
                                in: {
                                    $mergeObjects: [
                                    "$$this",
                                        {
                                            item_id: {
                                                $toObjectId: "$$this.item_id"
                                            }
                                        }
                                        
                                    ]
                                }
                            }
                        }
                    }
                },

                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project_id',
                        foreignField: '_id',
                        as: 'projectData'
                    },
                },
                { $unwind: "$projectData" },

                {
                    $lookup: {
                        from: 'quantityReportItems',
                        localField: 'boqitems.item_id',
                        foreignField: '_id',
                        as: 'reportItemData'
                    },
                },

                {
                    $lookup: {
                        from: 'units',
                        localField: 'boqitems.unit_id',
                        foreignField: '_id',
                        as: 'unitData'
                    },
                },

                {
                    $project: {
                        _id: 1,
                        company_id: 1,
                        project_id: 1,
                        project_name: "$projectData.project_name",
                        boqitems: {
                            $map: {
                                input: "$boqitems",
                                as: "i",
                                in: { 
                                    $mergeObjects: 
                                    [ "$$i",
                                        {
                                            $first: {
                                                $filter: {
                                                    input: "$reportItemData",
                                                    cond: 
                                                        { $eq: ["$$this._id","$$i.item_id"] },
                                                },
                                            },
                                        },
                                        // {
                                        //     $first: {
                                        //         $filter: {
                                        //             input: "$unitData",
                                        //             cond: { $eq: ["$$this._id","$$i.unit_id"] }
                                        //         }
                                        //     },
                                        // }
                                    ]
                                },

                            }, 
                        },
                    }
                }

            ])
        }
        catch (error) {
            return next(CustomErrorHandler.serverError());

        }

        return res.json({ status: 200, data: documents });
    },

    async store(req, res, next) {

        const { error } = manageBoqSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { company_id, project_id, item_id, unit_id, qty } = req.body;

        // try {
        //     const exist = await ManageBoq.exists({ project_id: ObjectId(project_id), item_id: ObjectId(item_id) });
        //     if (exist) {
        //         return next(CustomErrorHandler.alreadyExist('This item is already exist in this project'));
        //     }
        // } catch (err) {
        //     return next(err);
        // }

        // const manageBoq = new ManageBoq({
        //     company_id,
        //     project_id,
        //     item_id,
        //     unit_id,
        //     qty,
        // });
        // try {
        //     const result = await manageBoq.save();
        //     res.send(CustomSuccessHandler.success('BOQ created successfully'));
        // } catch (err) {
        //     return next(err);
        // }

        try {

            let project_exist_id;
            const project_exist = await ManageBoq.exists({ company_id: ObjectId(company_id), project_id: ObjectId(project_id) });

            if (!project_exist) {
                const createProject = new ManageBoq({
                    company_id,
                    project_id,
                });
                const result = await createProject.save();
                project_exist_id = result._id;
            } else {
                project_exist_id = project_exist._id;
            }

            const item_exist = await ManageBoq.exists({ _id: ObjectId(project_exist_id), boqitems: { $elemMatch: { item_id: ObjectId(item_id) } } });
            if (item_exist) {
                return next(CustomErrorHandler.alreadyExist('This item is already exist'));
            }

            await ManageBoq.findByIdAndUpdate(
                { _id: ObjectId(project_exist_id) },
                {
                    $push: {
                        boqitems: {
                            item_id: item_id,
                            unit_id: unit_id,
                            qty: qty,
                        }
                    }
                },
                { new: true }
            )
            res.send(CustomSuccessHandler.success('Boq created successfull'));
        } catch (err) {
            return next(err);
        }

    },

}

export default ManageBoqController;