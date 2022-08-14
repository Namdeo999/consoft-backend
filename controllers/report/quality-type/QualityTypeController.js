import { qualityTypeSchema } from "../../../validators/index.js";
import { QualityType } from "../../../models/index.js";
import CustomErrorHandler from "../../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../../services/CustomSuccessHandler.js";

const QualityTypeController = {
    async index(req, res, next){
        let documents;
        try {
            documents = await QualityType.find().select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },
    async store(req, res, next){
        const {error} = qualityTypeSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {type} = req.body;
        try {
            const exist = await QualityType.exists({type:type});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('Quality type is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const quality_type = new QualityType({
            type
        });

        try {
            const result = await quality_type.save();
            res.send(CustomSuccessHandler.success('Quality type created successfully'));
        } catch (err) {
            return next(err);
        }
    },

    async edit(req, res, next){
        let document;
        try {
            document = await QualityType.findOne({ _id:req.params.id }).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({status:200, document});
    },
    async update(req, res, next){
        const {error} = qualityTypeSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {type} = req.body;
        let document;
        try {
            document = await QualityType.findOneAndUpdate({ _id: req.params.id},{type},{new: true});
        } catch (err) {
            return next(err);
        }
        // res.status(201).json(document);
        return res.send(CustomSuccessHandler.success("Quality type updated successfully"))
    },
    async destroy(req, res, next){
        const document = await QualityType.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.send(CustomSuccessHandler.success("Quality type deleted successfully"))
    }
}

export default QualityTypeController;