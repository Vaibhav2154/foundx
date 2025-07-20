import {Router} from "express"
import { createTask, assignMember, updateTask, deAssignMember, getAllTasks, getTasksByProject} from "../controllers/task.controller.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router  = Router()

router.route('/:projectId/task/create').post(authMiddleware, createTask)
router.route('/:projectId/task/assignMember').post(authMiddleware, assignMember)
router.route('/:projectId/task/updateTask').post(authMiddleware, updateTask)
router.route('/:projectId/task/deAssignMember').post(authMiddleware, deAssignMember)
router.route('/:projectId/tasks').get(authMiddleware, getTasksByProject)
router.route('/task/getAllTasks').post(authMiddleware, getAllTasks)


export default router