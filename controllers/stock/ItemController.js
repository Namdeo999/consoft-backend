import Joi from "joi";
import Item from "../../models/Item.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";


const ItemController = {
    async index(req, res, next){
        let documents
        try {
            documents = await Item.find().select('-createdAt -updatedAt -__v');
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
    }

}

export default ItemController;