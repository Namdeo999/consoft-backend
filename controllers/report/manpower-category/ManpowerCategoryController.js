import { ManpowerCategory } from "../../../models/index.js";
import { manpowerCategorySchema } from "../../../validators/index.js";
import CustomErrorHandler from "../../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../../services/CustomSuccessHandler.js";
import CustomFunction from "../../../services/CustomFunction.js";


const ManpowerCategoryController = {

    async index(req, res, next){
        let documents;
        try {
            documents = await ManpowerCategory.find({company_id:req.params.company_id}).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async store(req, res, next){
        const {error} = manpowerCategorySchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {company_id, manpower_category} = req.body;
        try {
            const exist = await ManpowerCategory.exists({company_id:company_id, manpower_category:manpower_category});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist(CustomFunction.capitalize(`${manpower_category} is already exist`)));
            }
        } catch (err) {
            return next(err);
        }

        const category = new ManpowerCategory({
            company_id,
            manpower_category,
        });

        try {
            const result = await category.save();
            res.send(CustomSuccessHandler.success('Manpower category created successfully'));
        } catch (err) {
            return next(err);
        }

    },
    async edit(req, res, next){
        let document;
        try {
            document = await ManpowerCategory.findOne({ _id:req.params.id }).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({ status:200, data:document});
    },

    async update(req, res, next){
        const {error} = manpowerCategorySchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {company_id, manpower_category} = req.body;
        try {
            let document;
            const exist = await ManpowerCategory.exists({company_id:company_id, manpower_category:manpower_category});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist(CustomFunction.capitalize(`${manpower_category} is already exist`)) );
            }
            document = await ManpowerCategory.findByIdAndUpdate(
                { _id: req.params.id},
                {
                    company_id, 
                    manpower_category
                },
                {new: true}
            );
        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success( CustomFunction.capitalize(`${manpower_category} updated successfully`)));
    },
    async destroy(req, res, next) {
        const document = await ManpowerCategory.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.send(CustomSuccessHandler.success(CustomFunction.capitalize(`${document.manpower_category} deleted successfully`) ))
    },

}

export default ManpowerCategoryController;