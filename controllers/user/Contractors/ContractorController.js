import { Contractor, UserRole, User } from '../../../models/index.js'
import CustomSuccessHandler from '../../../services/CustomSuccessHandler.js'
const ContractorController = {
    // async index(req, res, next) {
        
    // },
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