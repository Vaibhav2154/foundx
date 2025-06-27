import { Router } from 'express';
import { loginUser, registerUser, logout } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.route('/register').post(
    registerUser
);
router.route('/login').post(loginUser)
router.route('/logout').post(authMiddleware,logout)

export default router;