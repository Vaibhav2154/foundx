import { Router } from "express";
import { createProject , getProjects, deleteProject, updateProject, getProjectById, addMembersToProject, removeMembers} from "../controllers/project.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/create").post(authMiddleware, createProject);
router.route("/").get(authMiddleware, getProjects)
router.route("/delete/:projectId").delete(authMiddleware, deleteProject)
router.route("/update/:projectId").put(authMiddleware, updateProject)
router.route("/:projectId").get(authMiddleware, getProjectById)
router.route("/addMembers").post(authMiddleware, addMembersToProject)
router.route("/removeMembers").post(authMiddleware, removeMembers)

export default router;
