import Joi from "joi";
import { ManageStock } from "../../models/index.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const ManageStockController = {

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

    }



}

export default ManageStockController;