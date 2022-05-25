import express from "express";
const router = express.Router();

import { registerController, loginController, userController, ProjectController } from '../controllers/index.js';
import auth from '../middlewares/auth.js'

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.get('/me',auth, userController.me);



router.post('/add-project', ProjectController.addProject);

export default router;