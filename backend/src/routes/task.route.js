import {Router} from "express"
import { createTask, assignMember, updateTask, deAssignMember,getAllTasks} from "../controllers/task.controller.js"

const router  = Router()

router.route('/:projectId/task/create').post(createTask)
router.route('/:projectId/task/assignMember').post(assignMember)
router.route('/:projectId/task/updateTask').post(updateTask)
router.route('/:projectId/task/deAssignMember').post(deAssignMember)
router.route('/task/getAllTasks').post(getAllTasks)


export default router