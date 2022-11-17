import Joi from "joi";
import { ObjectId } from "mongodb";
import { QuantityReportItem } from "../../../models/index.js";
import CustomErrorHandler from "../../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../../services/CustomSuccessHandler.js";
import Constants from "../../../constants/index.js";

const QuantityReportItemController = {

    async index(req, res, next){
        let documents
        try {
            documents =  await QuantityReportItem.aggregate([
                {
                    $match: { 
                        "company_id": ObjectId(req.params.company_id)
                    }
                },
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
                        company_id:1,
                        unit_id:1,
                        item_name:1,
                        unit_name:'$items.unit_name',
                    }
                } 
            ])
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({"status":200, data:documents});
    },
    
    async store(req, res, next){
        
        const quantityReportItemSchema = Joi.object({
            company_id: Joi.string().required(),
            item_name: Joi.string().required(),
            unit_id: Joi.string().required(),
        });
        
        const {error} = quantityReportItemSchema.validate(req.body);
        if(error){
            return next(error);
        }
        
        const { company_id, item_name, unit_id } = req.body;
        try {
            if (item_name != Constants.QUANTITY_ITEM_STEEL) {
                const exist = await QuantityReportItem.exists({company_id:company_id, item_name:Constants.QUANTITY_ITEM_STEEL}).collation({ locale:'en', strength:1});
                if(!exist){
                    await saveSteelQuantityItem(company_id, unit_id);
                }
            }
        } catch (err) {
            return next(err);
        }

        try {
            const exist = await QuantityReportItem.exists({company_id:company_id, item_name:item_name}).collation({ locale:'en', strength:1});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This item is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const quantity_report_item = new QuantityReportItem({
            company_id,
            item_name,
            unit_id,
        });

        try {
            const result = await quantity_report_item.save();
            res.send(CustomSuccessHandler.success('Item created successfull'));
        } catch (err) {
            return next(err);
        }
    },

    async edit(req, res, next){

    },
    async update(req, res, next){

    },
    async destroy(req, res, next){

    },

    async steelQuantityItem(req, res, next){
        let documents;
        try {
            await QuantityReportItem.find({company_id:req.params.company_id, item_name:'steel'}).select('-__v -company_id -unit_id').then(function([res]){
                documents = res;
            });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

}

async function saveSteelQuantityItem(company_id, unit_id){
    try {
        const steel_item = new QuantityReportItem({
            company_id,
            item_name:Constants.QUANTITY_ITEM_STEEL,
            unit_id,
        });
        await steel_item.save();
    } catch (err) {
        return next(err)
    }
    return ;
}

export default QuantityReportItemController;