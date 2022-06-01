import express from "express";
const router = express.Router();

import { 
    loginController, refreshController, registerController, userController, 
    ProjectController, ProjectCategoryController, UnitController, ItemController
} from '../controllers/index.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

// router.get('/me', userController.me);
router.post('/login', loginController.login);

router.post('/register', registerController.register);
router.get('/users', userController.index);

router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

//project category
router.get('/project-category', auth, ProjectCategoryController.index);
router.post('/project-category', [auth, admin], ProjectCategoryController.store);
router.get('/project-category/:id', [auth, admin], ProjectCategoryController.edit);
router.put('/project-category/:id', [auth, admin], ProjectCategoryController.update);
router.delete('/project-category/:id', [auth, admin], ProjectCategoryController.destroy);

//stock
router.get('/unit', UnitController.index);
router.post('/unit', UnitController.store);

router.get('/item', ItemController.index);
router.post('/item', ItemController.store);

// router.put('/products/:id', [auth, admin], productController.update);
// router.delete('/products/:id', [auth, admin], productController.destroy);
// router.get('/products', productController.index);
// router.get('/products/:id', productController.show);

//project routes
router.post('/projects',  ProjectController.store);
router.get('/projects',  ProjectController.show);

export default router;