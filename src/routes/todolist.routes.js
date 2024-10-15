import { Router } from "express";
import { authRequired } from "../middleware/validator.token";
import { verifyRole } from "../middleware/validator.role";
import { getTasks, getTask, addTask, updatedTask, deleteTask } from "../controller/todolist.controller";
const router = Router()

router.get('/tasks', authRequired, verifyRole(['admin','superadmin']), getTasks)

router.get('/task/:id',authRequired, verifyRole(['admin','superadmin']), getTask)

router.post('/addtask',authRequired, verifyRole(['superadmin']), addTask)

router.delete('/task/:id',authRequired, verifyRole(['superadmin']), updatedTask)

router.put('/task/:id',authRequired, verifyRole(['superadmin']), deleteTask)

export default router