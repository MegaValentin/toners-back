import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { getTasks, getTask, addTask, assignTask , deleteTask, completeTask, getMyTasks, revertTask} from "../controller/todolist.controller.js";

const router = Router()

router.get('/tasks', authRequired, verifyRole(['admin','superadmin']), getTasks)

router.get('/task/:id',authRequired, verifyRole(['admin','superadmin']), getTask)

router.post('/addtask',authRequired, verifyRole(['admin','superadmin']), addTask)

router.delete('/task/:id',authRequired, verifyRole(['admin','superadmin']), deleteTask )

router.put('/task/:id/assign',authRequired, verifyRole(['admin','superadmin']), assignTask)

router.put('/task/:id/complete', completeTask)

router.get('/mytasks', authRequired, getMyTasks)

router.put('/task/:id/revert',  revertTask)

export default router