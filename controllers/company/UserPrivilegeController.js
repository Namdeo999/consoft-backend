import { UserPrivilege } from "../../models/index.js";
import { userPrivilegeSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";

const UserPrivilegeController = {
    async index(req, res, next){
        let documents;
        try {
            documents = await UserPrivilege.find().select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async store(req, res, next){
        
        const {error} = userPrivilegeSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {privilege} = req.body;
        try {
            const exist = await UserPrivilege.exists({ privilege:privilege});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist(CustomFunction.capitalize(`${privilege} is already exist`)));
            }
        } catch (err) {
            return next(err);
        }

        const user_privilege = new UserPrivilege({
            privilege,
        });

        try {
            const result = await user_privilege.save();
            res.send(CustomSuccessHandler.success(CustomFunction.capitalize(`${privilege} created successfully`)));
        } catch (err) {
            return next(err);
        }
    },

    async edit(req, res, next){
        let document;
        try {
            document = await UserPrivilege.findOne({ _id:req.params.id }).select('-__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({"status":200, document});
    },

    async update(req, res, next){
        
        const {error} = userPrivilegeSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {privilege} = req.body;
        let document;
        try {
            const exist = await UserPrivilege.exists({ privilege:privilege });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist(CustomFunction.capitalize(`${privilege} is already exist`)));
            }
            document = await UserPrivilege.findOneAndUpdate({ _id: req.params.id},{privilege},{new:true});
        } catch (err) {
            return next(err);
        }
        // res.status(201).json(document);
        return res.send(CustomSuccessHandler.success(CustomFunction.capitalize(`${privilege} updated successfully`)))
    },

    async destroy(req, res, next) {
        const document = await UserPrivilege.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // return res.send({"status":200,"message": "Category deleted successfully" })
        return res.send(CustomSuccessHandler.success(CustomFunction.capitalize(`${document.privilege} deleted successfully`)))
    },

}

export default UserPrivilegeController;