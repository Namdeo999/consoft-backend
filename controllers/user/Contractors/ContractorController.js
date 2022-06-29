import { Contractor, UserRole, User } from '../../../models/index.js'
import CustomErrorHandler from '../../../services/CustomErrorHandler.js';
import CustomSuccessHandler from '../../../services/CustomSuccessHandler.js'
const ContractorController = {

    async index(req, res, next) {
        let documents;
        try {
            documents = await Contractor.find().select('-createdAt -updatedat -__v');
        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
        return res.json(documents);
    },
    async store(req, res, next) {
        const { contractor_name, phone_no } = req.body;
        const contractor = new Contractor({
            contractor_name,
            phone_no
        });

        try {
            const cont_result = await contractor.save();
            res.send(CustomSuccessHandler.success("Contractor added successfully!"))
        } catch (error) {
            return next(error)
        }
    }
}

export default ContractorController;