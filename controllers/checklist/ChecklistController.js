import Joi from "joi";
import { ObjectId } from "mongodb";
import { Checklist } from "../../models/index.js";
import { checklistSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const ChecklistController = {
    async index(req, res, next) {
        let documents;
        try {
            documents = await Checklist.aggregate([
                {
                    $match: {
                        "company_id": ObjectId(req.params.company_id)
                    }
                },
                {
                    $lookup:{
                        from:"checklistOptionTypes",
                        localField:"checklist_option_type_id",
                        foreignField:"_id",
                        as:"checklistOptionTypeData",
                    }
                },
                {
                    $unwind:"$checklistOptionTypeData"
                },
                {
                    $lookup:{
                        from:"checklistOptions",
                        localField:"checklist_option_type_id",
                        foreignField:"option_type_id",
                        as:"checklistOptionData",
                    }
                },
                {
                    $project:{
                        _id:1,
                        company_id:1,
                        checklist_option_type_id:1,
                        option_type:"$checklistOptionTypeData.option_type",
                        checklist_name:1,
                        items: {
                            _id:1,
                            checklist_item:1
                        },
                        options: {
                            $map: {
                                input: '$checklistOptionData',
                                as: 'checklistOptionDataPass',
                                in: {
                                    $mergeObjects: [
                                        {
                                            _id: '$$checklistOptionDataPass._id',
                                            checklist_option: '$$checklistOptionDataPass.checklist_option',
                                        },
                                    ],
                                }

                            }
                        }
                    }
                }
            ])

            // documents = await Checklist.aggregate([
            //     {
            //         $lookup: {
            //             from: "checklistItems",
            //             let: { "checklist_id": "$_id" },
            //             pipeline: [
            //                 {
            //                     $match: {
            //                         $expr: { $eq: ["$checklist_id", "$$checklist_id"] }
            //                     }
            //                 },
            //                 {
            //                     $lookup: {
            //                         from: "checklistOptionTypes",
            //                         localField: "checklist_option_type_id",
            //                         foreignField: "_id",
            //                         as: 'data'
            //                     }
            //                 },
            //                 {
            //                     $unwind: "$data"
            //                 },
            //                 {
            //                     $project: {
            //                         _id: 1,
            //                         checklist_id: 1,
            //                         checklist_option_type_id: 1,
            //                         checklist_item: 1,
            //                         option_type: "$data.option_type"

            //                     }
            //                 }
            //             ],
            //             as: "list",
            //         },
            //     },
            // ])
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    // async store(req, res, next) {

    //     const checklistSchema = Joi.object({
    //         checklist_name: Joi.string().required(),
    //         checklist_option_type_id: Joi.required(),
    //         checklist_item: Joi.required(),

    //     });

    //     const { error } = checklistSchema.validate(req.body);

    //     if (error) {
    //         return next(error);
    //     }

    //     try {
    //         const exist = await Checklist.exists({ checklist_name: req.body.checklist_name });
    //         if (exist) {
    //             return next(CustomErrorHandler.alreadyExist('The Checklist already exists'));
    //         }
    //     } catch (err) {
    //         return next(err);
    //     }

    //     const { checklist_name, checklist_item, checklist_option_type_id } = req.body;
    //     const checklist = new Checklist({
    //         checklist_name,
    //         // checklist_option_type_id,
    //         // checklist_item,
    //     });

    //     try {
    //         const result = await checklist.save();
    //         if (result) {
    //             const checklist_id = result._id;

    //             checklist_item.forEach(async function (item) {
    //                 const document = new ChecklistItem({
    //                     checklist_id: checklist_id,
    //                     checklist_option_type_id: checklist_option_type_id,
    //                     checklist_item: item,
    //                 })
    //                 const checklistItem = document.save();
    //             })

    //         }
    //         res.send(CustomSuccessHandler.success('Checklist created successfully'));
    //     } catch (err) {
    //         return next(err);
    //     }
    // },

    async store(req, res, next) {

        // const checklistSchema = Joi.object({
        //     company_id: Joi.string().required(),
        //     checklist_name: Joi.string().required(),
        //     checklist_option_type_id: Joi.required(),
        //     checklist_item: Joi.required(),
        // });

        const { error } = checklistSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { company_id, checklist_name, checklist_option_type_id, checklist_item } = req.body;

        let company_exist_id
        // const company_exist = await Checklist.findOne({ company_id: ObjectId(company_id) }).select('_id');
        const exist = await Checklist.exists({company_id: ObjectId(company_id), checklist_name: checklist_name});
        if (!exist) {
            const checklist = new Checklist({
                company_id,
                checklist_option_type_id,
                checklist_name,
            });
            const result = await checklist.save();
            company_exist_id = result._id;
        }else{
            company_exist_id = exist._id;
        }
        try {
            let company_checklist;
            checklist_item.forEach( async (element) => {
                company_checklist = await Checklist.find({
                    $and: [
                        { _id: { $eq: ObjectId(company_exist_id) }, items: { $elemMatch: { checklist_item: element } } }
                    ]
                })
                if (company_checklist.length === 0) {
                    await Checklist.findByIdAndUpdate(
                        { _id: ObjectId(company_exist_id) },
                        {
                            $push: {items: {checklist_item : element} } 
                        },
                        { new: true }
                    )
                }
            });
            res.send(CustomSuccessHandler.success('Checklist created successfully'));
        } catch (err) {
            return next(err); 
        }
    },

    async edit(req, res, next) {

        // let document;
        // try {
        //     document = await Checklist.aggregate([
        //         {
        //             $match: { _id: ObjectId(req.params.id) }
        //         },
        //         {
        //             $lookup: {
        //                 from: "checklistItems",
        //                 localField: "_id",
        //                 foreignField: "checklist_id",
        //                 pipeline: [
        //                     {
        //                         $lookup: {
        //                             from: "checklistOptionTypes",
        //                             localField: "checklist_option_type_id",
        //                             foreignField: "_id",
        //                             as: 'data2'
        //                         }
        //                     },
        //                     {
        //                         $unwind: "$data2"
        //                     },
        //                     {
        //                         $project: {
        //                             _id: 1,
        //                             checklist_id: 1,
        //                             checklist_option_type_id: 1,
        //                             checklist_item: 1,
        //                             option_type: "$data2.option_type"

        //                         }
        //                     }
        //                 ],
        //                 as: 'data'
        //             },
        //         },
        //     ])

        // } catch (err) {
        //     return next(CustomErrorHandler.serverError());
        // }

        // return res.json(document);
    },

    async update(req, res, next) {
    //     const { checklist_item, checklist_name, checklist_option_type_id, option_type } = req.body;
    //     let document;
    //     let checklistdocument;
    //     try {
    //         checklistdocument = await Checklist.findByIdAndUpdate(
    //             { _id: req.params.id },
    //             {
    //                 checklist_name,
    //             },
    //             { new: true },
    //         ).select('-createdAt -updatedAt -__v');

    //         if (checklistdocument) {
    //             document = await ChecklistItem.deleteMany(
    //                 { checklist_id: req.params.id }
    //             )
    //         }

    //     } catch (err) {
    //         return next(err);
    //     }
    //     res.status(201).json(document);
    },

    async destroy(req, res, next) {

    //     const document = await Checklist.findOneAndRemove({ _id: req.params.id });
    //     if (!document) {
    //         return next(new Error('Nothing to delete'));
    //     }
    //     return res.json(document);
    },


}

export default ChecklistController;