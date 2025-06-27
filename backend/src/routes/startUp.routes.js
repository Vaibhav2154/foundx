import {Router} from 'express';
import { createStartUp,getStartUp ,getAccessStartUp,getEmployees} from '../controllers/startUp.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { get } from 'mongoose';

const router = Router();

router.route('/create').post(authMiddleware, createStartUp);
router.route('/').get(authMiddleware,getStartUp)
router.route('/access').post(getAccessStartUp)
router.route('/getEmployees').post(getEmployees)
export default router;