import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { getTasks, getTask, addTask, assignTask , deleteTask } from "../controller/todolist.controller.js";

const router = Router()

router.get('/tasks', authRequired, verifyRole(['admin','superadmin']), getTasks)

router.get('/task/:id',authRequired, verifyRole(['admin','superadmin']), getTask)

router.post('/addtask',authRequired, verifyRole(['admin','superadmin']), addTask)

router.delete('/task/:id',authRequired, verifyRole(['superadmin']), deleteTask )

router.put('/task/:id/assing',authRequired, verifyRole(['admin','superadmin']), assignTask)

export default router