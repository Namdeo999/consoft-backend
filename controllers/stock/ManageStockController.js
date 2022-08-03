import Joi from "joi";
import { ManageStock, Item } from "../../models/index.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";

const ManageStockController = {

    async index(req, res, next){
        let documents;
        try {
            documents =  await ManageStock.aggregate([
                {
                    $lookup: {
                        from: 'items',
                        localField: 'item_id',
                        foreignField: '_id',
                        as: 'itemData'
                    },
                },
                { $unwind: "$itemData" },
                
                {
                    $project: {
                        _id:1,
                        item_id:1,
                        item_name:'$itemData.item_name',
                        qty:1,
                        location:1,
                        vehicle_no:1,
                    }
                } 
            ])
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({"status":200, data:documents});
    },

    async store(req, res, next){
        const manageStockSchema = Joi.object({
            item_id:Joi.string().required(),
            qty:Joi.number().required(),
            location:Joi.string().required(),
            vehicle_no:Joi.string().required(),
        });

        const {error} = manageStockSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {item_id, qty, location, vehicle_no} = req.body;
        const manageStock = new ManageStock({
            item_id,
            qty,
            location,
            vehicle_no,
        });

        try {
            const result = await manageStock.save();
            res.send(CustomSuccessHandler.success('Stock entry created successfully'));
        } catch (err) {
            return next(err);
        }

    },

    async edit(req, res, next){
        let document;
        try {
            document = await ManageStock.findOne({ _id:req.params.id }).select('-createdAt -updatedAt -__v');


            // document = await ManageStock.aggregate([
            //     {
            //       $lookup: {
            //         from: "items",
            //         localField: "item_id",
            //         foreignField: "_id",
            //         as: "items",
            //       },
            //     },
                
            // ]);

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },

    async update(req, res, next){
        const manageStockSchema = Joi.object({
            item_id:Joi.string().required(),
            qty:Joi.number().required(),
            location:Joi.string().required(),
            vehicle_no:Joi.string().required(),
        });

        const {error} = manageStockSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {item_id, qty, location, vehicle_no} = req.body;
        let document ; 
        try {
            document = await ManageStock.findByIdAndUpdate(
                {_id: req.params.id},
                {
                    item_id,
                    qty,
                    location,
                    vehicle_no,
                },
                {new : true},
                ).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);

    },

    async destroy(req, res, next) {
        const document = await ManageStock.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    },




}

export default ManageStockController;