import express from "express";
const router = express.Router();

import { registerController, loginController, refreshController, userController, ProjectController } from '../controllers/index.js';
import auth from '../middlewares/auth.js'

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me',auth, userController.me);

router.post('/refresh', refreshController.refresh);
router.post('/logout', auth, loginController.logout);

//project routes
router.post('/projects', ProjectController.store);
router.get('/projects', ProjectController.show);

export default router;