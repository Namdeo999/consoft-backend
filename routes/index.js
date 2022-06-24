import express from "express";
const router = express.Router();

import {  
    //auth
    registerController, loginController, refreshController, userController, 

    //company
    CompanyController, ProductKeyController, UserRoleController,

    //project
    ProjectCategoryController, ProjectTypeController, ProjectController, AssignWorkController,

    //stock
    UnitController, ItemController, ManageStockController,

    //checklist
    ChecklistOptionTypeController, ChecklistOptionController, ChecklistController

} from '../controllers/index.js';

import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

// router.get('/me', userController.me);
router.post('/login', loginController.login);

router.post('/company-login', CompanyController.companyLogin);
router.get('/company',  CompanyController.index);
router.post('/company',  CompanyController.store);

router.post('/verify-product-key',  ProductKeyController.verifyProductKey);

router.post('/register', registerController.register);
router.get('/users', userController.index);

router.get('/role', UserRoleController.index);
router.post('/role', UserRoleController.store);

router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

//project category
router.get('/project-category', ProjectCategoryController.index);
router.post('/project-category',  ProjectCategoryController.store);
router.get('/project-category/:id', ProjectCategoryController.edit);
router.put('/project-category/:id', ProjectCategoryController.update);
router.delete('/project-category/:id', ProjectCategoryController.destroy);

router.get('/project-type', ProjectTypeController.index);
router.post('/project-type', ProjectTypeController.store);
router.get('/project-type/:id', ProjectTypeController.edit);
router.put('/project-type/:id', ProjectTypeController.update);
router.delete('/project-type/:id', ProjectTypeController.destroy);

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

// router.put('/products/:id', [auth, admin], productController.update);
// router.delete('/products/:id', [auth, admin], productController.destroy);
// router.get('/products', productController.index);
// router.get('/products/:id', productController.show);


//project rouSETDSFDSFS

router.get('/projects',  ProjectController.index);
router.post('/projects',  ProjectController.store);
router.get('/projects/:id', ProjectController.edit);
router.put('/projects/:id', ProjectController.update);
router.delete('/projects/:id', ProjectController.destroy);

//Checklist items

router.get('/checklist-option-type', ChecklistOptionTypeController.index);
router.post('/checklist-option-type', ChecklistOptionTypeController.store);
router.get('/checklist-option-type/:id', ChecklistOptionTypeController.edit);
router.put('/checklist-option-type/:id', ChecklistOptionTypeController.update);
router.delete('/checklist-option-type/:id', ChecklistOptionTypeController.destroy);

router.get('/checklist-option', ChecklistOptionController.index);
router.post('/checklist-option', ChecklistOptionController.store);
router.get('/checklist-option/:id', ChecklistOptionController.edit);
router.put('/checklist-option/:id', ChecklistOptionController.update);
router.delete('/checklist-option/:id', ChecklistOptionController.destroy);

router.get('/checklists',ChecklistController.index);
router.post('/checklists',ChecklistController.store);
router.get('/checklists/:id',ChecklistController.edit);
router.put('/checklists/:id', ChecklistController.update);
router.delete('/checklists/:id', ChecklistController.destroy);

//AssignWork


router.get('/assign-works',AssignWorkController.index);
router.post('/assign-works',AssignWorkController.store);
router.get('/assign-works/:id',AssignWorkController.edit);
router.put('/assign-works/:id',AssignWorkController.update);
router.delete('/assign-works/:id',AssignWorkController.destroy);



//SubworkAssign 




export default router;
