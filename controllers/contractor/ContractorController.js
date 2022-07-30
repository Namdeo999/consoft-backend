import { Contractor } from '../../models/index.js';
import CustomErrorHandler from '../../services/CustomErrorHandler.js';
import CustomSuccessHandler from '../../services/CustomSuccessHandler.js'
import { contractorSchema } from '../../validators/index.js';

const ContractorController = {

    async index(req, res, next) {
        let documents;
        try {
            documents = await Contractor.find().select('-createdAt -updatedAt -__v');
        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
        return res.json(documents);
    },
    async store(req, res, next) {

        const {error} = contractorSchema.validate(req.body);
        if(error){
            return next(error);
        } 

        try {
            const exist = await Contractor.exists({project_id: req.body.project_id , contractor_name: req.body.contractor_name});
            // project = await ProjectTeam.find({
            //     $and: [
            //         { project_id: { $eq: ObjectId(project_id) }, users: { $elemMatch: { user_id: ObjectId(element) } } }
            //     ]
            // })
            if(exist){
                return next(CustomErrorHandler.alreadyExist('Contractor already exist in this project'));
            }
        } catch (err) {
            return next(err);
        }
        
        const { project_id, contractor_name, phone_no } = req.body;
        const contractor = new Contractor({
            project_id,
            contractor_name,
            phone_no
        });

        try {
            const cont_result = await contractor.save();
            res.send(CustomSuccessHandler.success("Contractor added successfully!"))
        } catch (error) {
            return next(error)
        }
    },

    async projectByContractor(req, res, next) {
        let documents;
        try {
            documents = await Contractor.find({project_id:req.params.project_id}).select('-createdAt -updatedAt -__v');
        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
        return res.json(documents);
    },

    async destroy(req, res, next) {
        let document;
        document = await Contractor.findOneAndRemove({ _id: req.params.contractor_id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // return res.send({"status":200,"message": "Category deleted successfully" })
        return res.send(CustomSuccessHandler.success("Contractor deleted successfully"))
    },

}

export default ContractorController;