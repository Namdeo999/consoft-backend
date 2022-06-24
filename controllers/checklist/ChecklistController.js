import Joi from "joi";
import { Checklist, ChecklistItem } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";


const ChecklistController = {
    async index(req, res, next) {
        let documents;
        try {
            documents = await Checklist.aggregate([
                {
                    $lookup: {
                        from: "checklistItems",
                        let: { "checklist_id": "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$checklist_id", "$$checklist_id"] }
                                }
                            },
                            {
                                $lookup: {
                                    from: "checklistOptionTypes",
                                    localField: "checklist_option_type_id",
                                    foreignField: "_id",
                                    as: 'data'
                                }
                            },
                            {
                                $unwind: "$data"
                            },
                            {
                                $project: {
                                    _id: 1,
                                    checklist_id: 1,
                                    checklist_option_type_id: 1,
                                    checklist_item: 1,
                                    option_type: "$data.option_type"

                                }

                            }


                        ],
                        as: "list",
                    },


                },
      
            ])

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    // async store(req, res, next) {

    //     const checklistSchema = Joi.object({
    //         title: Joi.string().required(),
    //         check_items: Joi.required(),
    //         checklist_option_type_id: Joi.required(),
    //     });

    //     const { error } = checklistSchema.validate(req.body);

    //     if (error) {
    //         return next(error);
    //     }

    //     try {
    //         const exist = await Checklist.exists({ title: req.body.title });
    //         if (exist) {
    //             return next(CustomErrorHandler.alreadyExist('The Title already exists'));
    //         }
    //     } catch (err) {
    //         return next(err);
    //     }

    //     const { title, check_items, checklist_option_type_id } = req.body;
    //     const checklist = new Checklist({
    //         title,
    //         check_items,
    //         checklist_option_type_id,
    //     });

    //     try {
    //         const result = await checklist.save();
    //         res.send(CustomSuccessHandler.success('Title created successfully'));
    //     } catch (err) {
    //         return next(err);
    //     }
    // },

    async store(req, res, next) {

        const checklistSchema = Joi.object({
            checklist_name: Joi.string().required(),
            checklist_option_type_id: Joi.required(),
            checklist_item: Joi.required(),

        });

        const { error } = checklistSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const exist = await Checklist.exists({ checklist_name: req.body.checklist_name });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('The Checklist already exists'));
            }
        } catch (err) {
            return next(err);
        }

        const { checklist_name, checklist_item, checklist_option_type_id } = req.body;
        const checklist = new Checklist({
            checklist_name,
            // checklist_option_type_id,
            // checklist_item,
        });

        try {
            const result = await checklist.save();
            if (result) {
                const checklist_id = result._id;

                checklist_item.forEach(async function (item) {
                    const document = new ChecklistItem({
                        checklist_id: checklist_id,
                        checklist_option_type_id: checklist_option_type_id,
                        checklist_item: item,
                    })
                    const checklistItem = document.save();
                })

            }
            res.send(CustomSuccessHandler.success('Checklist created successfully'));
        } catch (err) {
            return next(err);
        }
    },

    async edit(req, res, next) {
        let document;
        try {
            document = await Checklist.findOne({ _id: req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },
    async update(req, res, next) {
        const checklistSchema = Joi.object({
            title: Joi.string().required(),
            check_items: Joi.required(),
            checklist_option_type_id: Joi.required()
        });

        const { error } = checklistSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { title, check_items, checklist_option_type_id } = req.body;
        let document;
        try {
            document = await Checklist.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    title,
                    check_items,
                    checklist_option_type_id
                },
                { new: true },
            ).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
    },
    async destroy(req, res, next) {
        const document = await Checklist.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    },


}

export default ChecklistController;