import express from "express";
const router = express.Router();

import {
    //admin
    AdminDashboardController,
    //auth
    loginController, refreshController, userController, PaymentController,

    //company
    CompanyController, ProductKeyController, UserRoleController, UserPrivilegeController,

    //project
    ProjectCategoryController, ProjectTypeController, ProjectController, ProjectTeamController, ProjectReportPathController,

    //Assignwork
    AssignWorkController, UserAssignWorkController,

    //stock
    UnitController, ItemController, ManageStockController, ContractorController, ManageBoqController,

    //checklist
    ChecklistOptionTypeController, ChecklistOptionController, ChecklistController, ToolsMachineryController,

    //report 
    ReportController, QuantityReportController, QuantityReportItemController, QualityTypeController, ManpowerCategoryController, ManpowerSubCategoryController, ManpowerReportController,

    //supplier
    SupplierController,

    //revert
    RevertController, VerifyController, AttendanceController,

    //water level
    WaterLevelController, WaterSettingController,


} from '../controllers/index.js';


//company
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

import adminEditor from "../middlewares/adminEditor.js";

//user
import user_auth from '../middlewares/user_auth.js';

//admin
router.get('/companies', AdminDashboardController.index);
router.get('/pending-verify-payment', AdminDashboardController.pendingVerifyPayment);
router.put('/payment-verify', AdminDashboardController.paymentVerify);

// router.get('/me', userController.me);
router.post('/login', loginController.login);

router.post('/company-login', CompanyController.companyLogin);
router.get('/company', [auth, admin], CompanyController.index);
router.post('/company', CompanyController.store);
router.post('/company-logout', CompanyController.companyLogout);

router.post('/verify-product-key', ProductKeyController.verifyProductKey);

router.post('/user-register', userController.userRegister);
// router.get('/user', user_auth, userController.user);
router.get('/user/:user_id', userController.user);
router.get('/users/:company_id', userController.index);
router.put('/update-user/:id', userController.update);

router.get('/role-by-users/:company_id/:role_id', userController.roleByUsers);
router.get('/privilege-by-users/:company_id/:privilege_id', userController.privilegeByUsers);

router.post('/refresh', refreshController.refresh);
router.post('/logout', loginController.logout);

//payment
router.get('/payment', PaymentController.index);
router.post('/payment', PaymentController.store);



//role
router.get('/role/:company_id', UserRoleController.index);
router.post('/role', UserRoleController.store);
router.get('/edit-role/:id', UserRoleController.edit);
router.put('/update-role/:id', UserRoleController.update);
router.delete('/delete-role/:id', UserRoleController.destroy);

// user privilege
router.get('/privilege', UserPrivilegeController.index);
router.post('/privilege', UserPrivilegeController.store);
router.get('/privilege/:id', UserPrivilegeController.edit);
router.put('/privilege/:id', UserPrivilegeController.update);
router.delete('/privilege/:id', UserPrivilegeController.destroy);

//project category
router.get('/project-category/:company_id', ProjectCategoryController.index);
router.post('/project-category', ProjectCategoryController.store);
router.get('/project-category/:id', ProjectCategoryController.edit);
router.put('/project-category/:id', ProjectCategoryController.update);
router.delete('/project-category/:id', ProjectCategoryController.destroy);

router.get('/project-type/:company_id', ProjectTypeController.index);
router.get('/project-type-by-category/:category_id', ProjectTypeController.getProjectTypeByCategory);
router.post('/project-type', ProjectTypeController.store);
router.get('/project-type/:id', ProjectTypeController.edit);
router.put('/project-type/:id', ProjectTypeController.update);
router.delete('/project-type/:id', ProjectTypeController.destroy);

//project 
router.get('/projects/:company_id', ProjectController.index);
router.post('/projects', ProjectController.store);
router.get('/edit-projects/:id', ProjectController.edit);
router.put('/projects/:id', ProjectController.update);
router.delete('/projects/:id', ProjectController.destroy);

router.get('/projects-at-glance/:company_id', ProjectController.projectAtGlance);

router.get('/user-by-projects/:user_id', ProjectController.userByProjects);


//project team
router.get('/project-team/:project_id', ProjectTeamController.index);
router.post('/project-team', ProjectTeamController.store);
router.put('/project-team/:id', ProjectTeamController.update);
router.delete('/project-team/:id', ProjectTeamController.destroy);
// router.delete('/project-team/:project_id/:user_id', ProjectTeamController.destroy);

router.get('/project-team-role-wise/:project_id', ProjectTeamController.projectTeamRoleWise);//pending

//project report path
router.get('/project-report-path/:company_id/:project_id', ProjectReportPathController.index);
router.post('/project-report-path', ProjectReportPathController.store);
router.put('/project-report-path/:id', ProjectReportPathController.update);
router.delete('/project-report-path/:id', ProjectReportPathController.destroy);

//stock
router.get('/unit', UnitController.index);
router.post('/unit', UnitController.store);
router.get('/unit/:id', UnitController.edit);
router.put('/unit/:id', UnitController.update);
router.delete('/unit/:id', UnitController.destroy);

router.get('/item', ItemController.index);
router.post('/item', ItemController.store);
router.get('/item/:id', ItemController.edit);
router.put('/item/:id', ItemController.update);
router.delete('/item/:id', ItemController.destroy);

router.get('/stock-entry', ManageStockController.index);
router.post('/stock-entry', ManageStockController.store);
router.get('/stock-entry/:id', ManageStockController.edit);
router.put('/stock-entry/:id', ManageStockController.update);

//boq
// router.get('/manage-boq/:company_id/:project_id?', ManageBoqController.index);
router.get('/manage-boq/:company_id/:project_id', ManageBoqController.index);
router.post('/manage-boq', ManageBoqController.store);
router.get('/edit-manage-boq/:id', ManageBoqController.edit);//pending
router.put('/update-manage-boq/:id', ManageBoqController.update);

router.get('/boq-cal', ManageBoqController.boqcal);

// router.put('/products/:id', [auth, admin], productController.update);
// router.delete('/products/:id', [auth, admin], productController.destroy);
// router.get('/products', productController.index);
// router.get('/products/:id', productController.show);

//const BASE_IMG_URL = "http://sdplaccount.sdplweb.com/storage/app/public/";
//const BASE_IMG_URL = "http://192.168.1.98:99/sdpl-account/storage/app/public/";

//Checklist items
router.get('/checklist-option-type', [auth, adminEditor], ChecklistOptionTypeController.index);
// router.get('/checklist-option-type', ChecklistOptionTypeController.index);
// router.get('/checklist-option-type/:company_id', ChecklistOptionTypeController.index);
router.post('/checklist-option-type', ChecklistOptionTypeController.store);
router.get('/checklist-option-type/:id', ChecklistOptionTypeController.edit);
router.put('/checklist-option-type/:id', ChecklistOptionTypeController.update);
router.delete('/checklist-option-type/:id', ChecklistOptionTypeController.destroy);

router.get('/checklist-option', ChecklistOptionController.index);
router.post('/checklist-option', ChecklistOptionController.store);
router.get('/checklist-option/:id', ChecklistOptionController.edit);
router.put('/checklist-option/:id', ChecklistOptionController.update);
router.delete('/checklist-option/:id', ChecklistOptionController.destroy);

router.get('/checklists/:company_id', ChecklistController.index);
router.post('/checklists', ChecklistController.store);
router.get('/checklists/:id', ChecklistController.edit);
router.put('/checklists/:id', ChecklistController.update);
router.delete('/checklists/:id', ChecklistController.destroy);

//AssignWork
router.get('/assign-works/:company_id', AssignWorkController.assignWork);
router.get('/submit-works/:company_id', AssignWorkController.submitWork);
router.post('/assign-works', AssignWorkController.store);
router.get('/assign-works/:id', AssignWorkController.edit);
router.put('/assign-works/:id', AssignWorkController.update);
// router.delete('/assign-works/:id',AssignWorkController.destroy);
router.get('/verify-revert-works/:company_id', AssignWorkController.verifyRevertWorks);
router.delete('/sub-assign-work/:id', AssignWorkController.destroySubAssignWork);

router.put('/change-work-completion-time/:work_id', AssignWorkController.changeWorkCompletionTime);

//user-end assignwork
router.get('/user-assign-works/:user_id', UserAssignWorkController.index)
router.put('/user-submit-work/:work_id', UserAssignWorkController.userSubmitWork)
router.get('/user-completed-works/:user_id', UserAssignWorkController.userCompletedWork)
// router.put('/user-assign-works/:id',UserAssignWorkController.update)
router.put('/user-work-comment/:work_id', UserAssignWorkController.userWorkComment)

//Tools And Machinery
router.get('/tools-machinery', ToolsMachineryController.index);
router.get('/tools-machinery-report/:project_id/:user_id/:date', ToolsMachineryController.getTAndPReport);
router.get('/edit-tools-machinery-report/:id', ToolsMachineryController.tAndPEditReport);
router.get('/tools-machinery/:id', ToolsMachineryController.edit);
router.post('/tools-machinery', ToolsMachineryController.store);
router.put('/tools-machinery-report/:id', ToolsMachineryController.tAndPUpdateReport);
router.put('/tools-machinery/:id', ToolsMachineryController.update);
router.delete('/tools-machinery/:id', ToolsMachineryController.destroy);

//contractors
router.get('/contractor', ContractorController.index);
router.get('/project-by-contractor/:project_id', ContractorController.projectByContractor);
router.post('/contractor', ContractorController.store);
router.put('/contractor/:id', ContractorController.update);
router.delete('/contractor/:contractor_id', ContractorController.destroy);

//report
router.post('/report/:type', ReportController.saveReport);

//admin
router.get('/report/:project_id/:date?/:user_id?', ReportController.index);

router.get('/manpower-report/:project_id/:user_id/:date', ManpowerReportController.index);
router.get('/manpower-report-by-report-id/:report_id', ManpowerReportController.manpowerReportByReportId);
router.get('/edit-manpower-report/:contractor_id/:date', ManpowerReportController.edit);
router.put('/manpower-report/:manpower_report_id', ManpowerReportController.update);

router.get('/quantity-report/:project_id/:user_id/:date', QuantityReportController.index);
router.get('/quantity-report-by-report-id/:report_id', QuantityReportController.quantityReportByReportId);

router.get('/edit-quantity-report/:id', QuantityReportController.edit);
router.put('/quantity-report/:id', QuantityReportController.update);
router.delete('/quantity-report/:id', QuantityReportController.destroy);

router.put('/final-submit-report/:company_id/:project_id/:user_id/:date', ReportController.finalSubmitReport);
// router.post('/quantity-report',QuantityReportController.store);
router.get('/quantity-item-exist/:project_id/:user_id/:date', QuantityReportController.quantityItemExist);


//report verify
router.put('/verify-report/:project_id/:report_id/:user_id', VerifyController.verifyReport);
router.put('/final-verify-report/:company_id/:project_id/:report_id', VerifyController.finalVerifyReport);

// report item
router.get('/quantity-report-item/:company_id', QuantityReportItemController.index);
router.post('/quantity-report-item', QuantityReportItemController.store);
router.get('/edit-quantity-report-item/:id', QuantityReportItemController.edit);
router.put('/update-quantity-report-item/:id', QuantityReportItemController.update);
router.delete('/delete-quantity-report-item/:id', QuantityReportItemController.destroy);
router.get('/steel-quantity-item/:company_id', QuantityReportItemController.steelQuantityItem);

//quality type
router.get('/quality-type/', QualityTypeController.index);
router.post('/quality-type/', QualityTypeController.store);
router.get('/quality-type/:id', QualityTypeController.edit);
router.put('/quality-type/:id', QualityTypeController.update);
router.delete('/quality-type/:id', QualityTypeController.destroy);

//manpower category
router.get('/manpower-category/:company_id/:project_id', ManpowerCategoryController.index);
router.post('/manpower-category', ManpowerCategoryController.store);
router.get('/edit-manpower-category/:id', ManpowerCategoryController.edit);
router.put('/manpower-category/:id', ManpowerCategoryController.update);
router.delete('/manpower-category/:id', ManpowerCategoryController.destroy);



router.get('/manpower-category/:company_id/:project_id/:contractor_id', ManpowerCategoryController.getManpowerCategoryByContractor);

//manpower sub category
// router.get('/manpower-sub-category/:manpower_category_id', ManpowerSubCategoryController.index);
router.get('/manpower-sub-category/:company_id', ManpowerSubCategoryController.index);
router.post('/manpower-sub-category', ManpowerSubCategoryController.store);
router.get('/edit-manpower-sub-category/:id', ManpowerSubCategoryController.edit);
router.put('/manpower-sub-category/:id', ManpowerSubCategoryController.update);
router.delete('/manpower-sub-category/:id', ManpowerSubCategoryController.destroy);

router.get('/supplier/:company_id', SupplierController.index);
router.post('/supplier', SupplierController.store);
router.get('/edit-supplier/:supplier_id', SupplierController.edit);
router.put('/supplier/:supplier_id', SupplierController.update);
router.delete('/supplier/:supplier_id', SupplierController.destroy);

//revert
router.put('/revert-submit-work/:work_id', RevertController.revertSubmitWork);
router.put('/revert-report/:project_id/:report_id/:user_id', RevertController.revertReport);
router.put('/final-revert-report/:company_id/:project_id/:report_id', RevertController.finalRevertReport);

//verify
router.get('/verify-submit-work/:work_id', VerifyController.verifySubmitWork);

//user profile

router.get('/attendance/:company_id/:year?/:month?/:user_id?', AttendanceController.index);
// router.get('/attendance/:company_id/:user_id?', AttendanceController.index);

router.get('/check-present/:company_id/:user_id', AttendanceController.checkPresent);

router.post('/attendance', AttendanceController.attendance);

router.get('/leaves/:company_id', AttendanceController.getLeaves);
router.post('/apply-leaves', AttendanceController.applyLeaves);
router.put('/approve-leaves/:id', AttendanceController.approveLeaves);

//old route
// router.get('/water-level/:led_status', WaterLevelController.waterLevel);
// router.get('/water-level', WaterLevelController.index);
// router.post('/water-level', WaterLevelController.waterLevel);
// router.get('/led-status', WaterLevelController.getLedStatus);
// router.post('/led-status', WaterLevelController.updateLedStatus);

//water level
router.get('/led-status/:unique_id', WaterLevelController.getLedStatus);
router.put('/led-status/:unique_id', WaterLevelController.updateLedStatus);

router.get('/sump-status/:unique_id', WaterLevelController.getSumpStatus);
router.put('/sump-status/:unique_id', WaterLevelController.updateSumpStatus);

router.get('/water-level/:unique_id', WaterLevelController.getWaterLevel);
router.put('/water-level/:unique_id', WaterLevelController.updateWaterLevel);

router.get('/water-level-image/:unique_id', WaterLevelController.getWaterLevelImage);
router.post('/water-level-image/:unique_id', WaterLevelController.saveWaterLevelImage);

router.get('/water-level-setting/:unique_id', WaterSettingController.getWaterSetting);
router.put('/water-level-setting/:unique_id', WaterSettingController.setWaterSetting);

// router.get('/pump-notification-setting/:unique_id', WaterSettingController.getWaterSetting);
router.put('/motor-notification-setting/:unique_id', WaterSettingController.setMotorNotificationSetting);

router.put('/tank-height-setting/:unique_id', WaterSettingController.tankHeightSetting);
router.put('/water-source-setting/:unique_id', WaterSettingController.waterSourceSetting);


export default router;
