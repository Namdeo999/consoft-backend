// export { default as registerController } from './auth/demoregisterController.js';
export { default as loginController } from '../controllers/auth/loginController.js';
export { default as userController } from '../controllers/auth/userController.js';
export { default as refreshController } from '../controllers/auth/refreshController.js';
export { default as UserRoleController } from './company/UserRoleController.js';

//mail
// export { default as MailControllher } from './MailController.js';

//product 
export { default as ProductKeyController } from '../controllers/auth/ProductKeyController.js';

//company
export { default as CompanyController } from '../controllers/company/CompanyController.js';

export { default as ProjectController } from './project/ProjectController.js';
export { default as ProjectCategoryController } from './project/ProjectCategoryController.js';
export { default as ProjectTypeController } from './project/ProjectTypeController.js';
export { default as ProjectTeamController } from './project/ProjectTeamController.js';

//stock controller 
export { default as UnitController } from './stock/UnitController.js';
export { default as ItemController } from './stock/ItemController.js';
export { default as ManageStockController } from './stock/ManageStockController.js';

//tools machinery
export { default as ToolsMachineryController } from './tools-machinery/toolsMachineryController.js';

//checklist
export { default as ChecklistOptionTypeController } from './checklist/ChecklistOptionTypeController.js';
export { default as ChecklistOptionController } from './checklist/ChecklistOptionController.js';
export { default as ChecklistController } from './checklist/ChecklistController.js'

export { default as AssignWorkController} from './assign-work/AssignWorkController.js';
export { default as UserAssignWorkController} from '../controllers/user/UserAssignWorkController.js';

//contractor controller

export {default as ContractorController } from '../controllers/user/Contractors/ContractorController.js';

//report

export { default as QuantityReportController } from './report/QuantityReportController.js';

export { default as QuantityReportItemController } from './report/quantity-report-item/QuantityReportItemController.js';

