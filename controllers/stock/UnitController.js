import Joi from "joi";
import { Unit } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const UnitController = {
    async index(req, res, next){
        let documents;
        try {
            documents = await Unit.find().select('-createdAt -updatedAt -__v');
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async store(req, res, next){
        //validation
        const unitSchema = Joi.object({
            unit_name: Joi.string().required(),
        });
        
        const {error} = unitSchema.validate(req.body);
        if(error){
            return next(error);
        }
        //check exist
        try {
            const exist = await Unit.exists({unit_name:req.body.unit_name});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This unit is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const { unit_name } = req.body;
        const unit = new Unit({
            unit_name,
        });

        try {
            const result = await unit.save();
            res.send(CustomSuccessHandler.success('Unit created successfull'));
        } catch (err) {
            return next(err);
        }

    },

    async edit(req, res, next){
        let document;
        try {
            document = await Unit.findOne({ _id:req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },

    async update(req, res, next){
        const unitSchema = Joi.object({
            unit_name: Joi.string().required(),
        });
        
        const {error} = unitSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {unit_name} = req.body;

        let document;
        try {
            document = await Unit.findOneAndUpdate(
                { _id: req.params.id},
                {unit_name},
                {new: true}
            );
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
    },

    async destroy(req, res, next) {
        const document = await Unit.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    },

    // async unitName(req, res, next){
    //     let document;
    //     try {
    //         document = await Unit.findOne({ _id:req.params.id }).select('-createdAt -updatedAt -__v');

    //         // document = await Customer.aggregate([
    //         //     {
    //         //       $lookup: {
    //         //         from: "orders",
    //         //         localField: "_id",
    //         //         foreignField: "customerId",
    //         //         as: "orders_info",
    //         //       },
    //         //     },
    //         // ])


    //     } catch (err) {
    //         return next(CustomErrorHandler.serverError());
    //     }
    // }

}

export default UnitController;