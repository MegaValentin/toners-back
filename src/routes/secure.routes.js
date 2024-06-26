import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { adminFunction, employeeFunction } from "../controller/secure.controller.js";
const router = Router()

router.get('/admin', authRequired, verifyRole('admin'), adminFunction);
router.get('/employee', authRequired, verifyRole('empleado'), employeeFunction);

export default router
