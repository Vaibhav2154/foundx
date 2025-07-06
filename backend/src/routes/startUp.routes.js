import {Router} from 'express';
import { createStartUp,getStartUp ,getAccessStartUp,getEmployees, accessAndJoinStartUp, addEmployeeToStartUp, removeEmployeeFromStartUp} from '../controllers/startUp.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { get } from 'mongoose';

const router = Router();

router.route('/create').post(authMiddleware, createStartUp);
router.route('/').get(authMiddleware,getStartUp)
router.route('/access').post(authMiddleware,getAccessStartUp)
router.route('/getEmployees').post(authMiddleware,getEmployees)
router.route('/accessAndJoin').post(authMiddleware, accessAndJoinStartUp);
router.route('/addEmployee').post(authMiddleware, addEmployeeToStartUp);
router.route('/removeEmployee').post(authMiddleware, removeEmployeeFromStartUp);

export default router;