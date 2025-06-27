import {Router} from "express"
import { createTask, assignMember, updateTask, deAssignMember} from "../controllers/task.controller.js"

const router  = Router()

router.route('/:projectId/task/create').post(createTask)
router.route('/:projectId/task/assignMember').post(assignMember)
router.route('/:projectId/task/updateTask').post(updateTask)
router.route('/:projectId/task/deleteMember').post(deAssignMember)


export default router