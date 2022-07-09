import Joi from "joi";
import {Item} from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";


const ItemController = {
    async index(req, res, next){
        let documents
        try {
            // documents = await Item.find().select('-createdAt -updatedAt -__v');

            documents =  await Item.aggregate([
                {
                    $lookup: {
                        from: 'units',
                        localField: 'unit_id',
                        foreignField: '_id',
                        as: 'items'
                    },
                },
                { $unwind: "$items" },
                
                {
                    $project: {
                        _id:1,
                        unit_id:1,
                        item_name:1,
                        unit_name:'$items.unit_name',
                    }
                } 
            ])
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async store(req, res, next){
        //validation
        const itemSchema = Joi.object({
            unit_id: Joi.string().required(),
            item_name: Joi.string().required(),
        });
        
        const {error} = itemSchema.validate(req.body);
        if(error){
            return next(error);
        }
        //check exist
        try {
            const exist = await Item.exists({item_name:req.body.item_name});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This item is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const { unit_id, item_name } = req.body;
        const item = new Item({
            unit_id,
            item_name,
        });

        try {
            const result = await item.save();
            res.send(CustomSuccessHandler.success('Item created successfull'));
        } catch (err) {
            return next(err);
        }
    },

    async edit(req, res, next){
        let document;
        try {
            document = await Item.findOne({ _id:req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },

    async update(req, res, next){
        const itemSchema = Joi.object({
            unit_id: Joi.string().required(),
            item_name: Joi.string().required(),
        });

        const {error} = itemSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {unit_id, item_name} = req.body;
        let document ;
        try {
            document = await Item.findOneAndUpdate(
                {_id: req.params.id},
                {unit_id, item_name,},
                {new : true}
            ).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
    },

    async destroy(req, res, next) {
        const document = await Item.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    },

}

export default ItemController;