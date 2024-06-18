import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";

const router = Router()

const adminFunction = (req, res) => {
    res.status(200).json({message:'Admin functionaly executed'})
}
const employeeFunction = (req, res) => {
    res.status(200).json({message:"Employee functionaly executed"})
}

router.get('/admin', authRequired, verifyRole('admin'), adminFunction);
router.get('/employee', authRequired, verifyRole('empleado'), employeeFunction);

export default router
