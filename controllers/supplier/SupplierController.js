import { Supplier } from "../../models/index.js";
import { supplierSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const SupplierController = {

    async index(req, res, next){
        let documents
        try {
            documents = await Supplier.find();
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({"status":200, data:documents});
    },

    async store(req, res, next){
        
        const {error} = supplierSchema.validate(req.body);
        if(error){
            return next(error);
        }

        try {
            const exist = await Supplier.exists({supplier_mobile:req.body.supplier_mobile});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This supplier is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const {supplier_name, supplier_mobile, supplier_email, supplier_location} = req.body;
        const supplier = new Supplier({
            supplier_name, 
            supplier_mobile, 
            supplier_email, 
            supplier_location
        });

        try {
            const result = await supplier.save();
            res.send(CustomSuccessHandler.success('Supplier created successfully'));
        } catch (err) {
            return next(err);
        }

    },

    async edit(req, res, next){
        let document;
        try {
            document = await Supplier.findOne({ _id:req.params.supplier_id });
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({"status":200, document});
    },

    async update(req, res, next){
        
        const {error} = supplierSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {supplier_name, supplier_mobile, supplier_email, supplier_location} = req.body;
        let document;
        try {
            document = await Supplier.findOneAndUpdate(
                { _id: req.params.supplier_id},
                {
                    supplier_name,
                    supplier_mobile,
                    supplier_email,
                    supplier_location
                },
                {new: true});
        } catch (err) {
            return next(err);
        }
        // res.status(201).json(document);
        return res.send(CustomSuccessHandler.success("Supplier updated successfully"))

    },

    async destroy(req, res, next) {
        const document = await Supplier.findOneAndRemove({ _id: req.params.supplier_id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // return res.send({"status":200,"message": "Category deleted successfully" })
        return res.send(CustomSuccessHandler.success("Supplier deleted successfully"))
    },

}

export default SupplierController;