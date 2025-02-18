//admin
export { default as AdminDashboardController } from './admin/AdminDashboardController.js';

// export { default as registerController } from './auth/demoregisterController.js';
export { default as loginController } from '../controllers/auth/loginController.js';
export { default as userController } from '../controllers/auth/userController.js';
export { default as refreshController } from '../controllers/auth/refreshController.js';
export { default as UserRoleController } from './company/UserRoleController.js';
export { default as UserPrivilegeController } from './company/UserPrivilegeController.js';

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
export { default as ProjectReportPathController } from './project/ProjectReportPathController.js';

//stock controller 
export { default as UnitController } from './stock/UnitController.js';
export { default as ItemController } from './stock/ItemController.js';
export { default as ManageStockController } from './stock/ManageStockController.js';
export { default as ManageBoqController } from './stock/boq/ManageBoqController.js';

//tools machinery
export { default as ToolsMachineryController } from './tools-machinery/ToolsMachineryController.js';

//checklist
export { default as ChecklistOptionTypeController } from './checklist/ChecklistOptionTypeController.js';
export { default as ChecklistOptionController } from './checklist/ChecklistOptionController.js';
export { default as ChecklistController } from './checklist/ChecklistController.js'

//assign work
export { default as AssignWorkController } from './assign-work/AssignWorkController.js';
export { default as UserAssignWorkController } from './assign-work/UserAssignWorkController.js';

//contractor controller

export { default as ContractorController } from './contractor/ContractorController.js';

//report 

export { default as ReportController } from './report/ReportController.js'
export { default as ManpowerCategoryController } from './report/manpower-category/ManpowerCategoryController.js';
export { default as ManpowerSubCategoryController } from './report/manpower-sub-category/ManpowerSubCategoryController.js';
export { default as QuantityReportController } from './report/QuantityReportController.js';
export { default as QuantityReportItemController } from './report/quantity-report-item/QuantityReportItemController.js';
export { default as QualityTypeController } from './report/quality-type/QualityTypeController.js';
export { default as ManpowerReportController } from './report/ManpowerReportController.js';

//voucher
export {default as VoucherController } from './voucher/VoucherController.js';

//supplier
export { default as SupplierController } from './supplier/SupplierController.js';

//revert
export { default as RevertController } from './revert/RevertController.js';

//verify
export { default as VerifyController } from './verify/VerifyController.js';

//user profile
export { default as AttendanceController } from './user-profile/AttendanceController.js';

//payment 
export { default as PaymentController } from './payment/PaymentController.js';

//water level

export { default as WaterLevelController } from './water-level/WaterLevelController.js';
export { default as WaterSettingController } from './water-level/WaterSettingController.js';
