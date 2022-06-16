import express from "express";
const router = express.Router();

import { 
    loginController, refreshController, registerController, userController, CompanyController, 
    ProjectController, ProjectCategoryController, ProjectTypeController, UnitController, ItemController, 
    ManageStockController, UserRoleController
} from '../controllers/index.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

// router.get('/me', userController.me);
router.post('/login', loginController.login);

router.get('/company',  CompanyController.index);
router.post('/company',  CompanyController.store);

router.post('/register', registerController.register);
router.get('/users', userController.index);

router.get('/role',  UserRoleController.index);
router.post('/role',  UserRoleController.store);

router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

//project category
router.get('/project-category', ProjectCategoryController.index);
router.post('/project-category',  ProjectCategoryController.store);
router.get('/project-category/:id', ProjectCategoryController.edit);
router.put('/project-category/:id', ProjectCategoryController.update);
router.delete('/project-category/:id', ProjectCategoryController.destroy);

router.get('/project-type', ProjectTypeController.index);
router.post('/project-type',  ProjectTypeController.store);

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

router.post('/stock-entry', ManageStockController.store);

// router.put('/products/:id', [auth, admin], productController.update);
// router.delete('/products/:id', [auth, admin], productController.destroy);
// router.get('/products', productController.index);
// router.get('/products/:id', productController.show);


//project rou


router.get('/projects',  ProjectController.index);
router.post('/projects',  ProjectController.store);
router.get('/projects/:id', ProjectController.edit);
router.put('/projects/:id', ProjectController.update);
router.delete('/projects/:id', ProjectController.destroy);


export default router;
