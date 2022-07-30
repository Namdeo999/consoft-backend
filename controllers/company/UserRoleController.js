import { UserRole } from "../../models/index.js";
import { userRoleSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";

const UserRoleController = {

    async index(req, res, next){
        let documents;
        try {
            documents = await UserRole.find().select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async store(req, res, next){
        
        const {error} = userRoleSchema.validate(req.body);
        if(error){
            return next(error);
        }

        try {
            const exist = await UserRole.exists({user_role:req.body.user_role});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This user role is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const {company_id, user_role} = req.body;
        const role = new UserRole({
            company_id,
            user_role,
        });

        try {
            const result = await role.save();
            res.send(CustomSuccessHandler.success('User role created successfully'));
        } catch (err) {
            return next(err);
        }

    },

    async edit(req, res, next){
        let document;
        try {
            document = await UserRole.findOne({ _id:req.params.id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(document);
    },

    async update(req, res, next){
        
        const {error} = userRoleSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {company_id, user_role} = req.body;
        let document;
        try {
            document = await UserRole.findOneAndUpdate({ _id: req.params.id},{company_id, user_role},{new: true});
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
    },

    async destroy(req, res, next) {
        const document = await UserRole.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.json(document);
    }
    

}


export default UserRoleController;