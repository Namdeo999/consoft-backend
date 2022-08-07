import Joi from "joi";
import { ObjectId } from "mongodb";
import { QuantityReportItem } from "../../../models/index.js";
import CustomErrorHandler from "../../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../../services/CustomSuccessHandler.js";

const QuantityReportItemController = {

    async index(req, res, next){
        let documents
        try {
            documents =  await QuantityReportItem.aggregate([
                {
                    $match: { 
                        // $and:[
                            "company_id": ObjectId(req.params.company_id)
                        // ]
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
        
        try {
            const exist = await QuantityReportItem.exists({item_name:req.body.item_name});
            if(exist){
                return next(CustomErrorHandler.alreadyExist('This item is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const {  company_id, item_name, unit_id } = req.body;
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
    }

    


}

export default QuantityReportItemController;