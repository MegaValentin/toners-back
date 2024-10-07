import { Router } from "express";
import { registerUser, login, logout, profile, verifyToken, addUser, getUser, deleteUser } from "../controller/users.controller.js"; 
import { validateSchema } from "../middleware/validator.middleware.js";
import { resgisterSchema, loginSchema } from "../schemas/auth.schemas.js";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";

const router = Router()

router.post('/register',validateSchema(resgisterSchema), registerUser )
router.post("/login", validateSchema(loginSchema), login)
router.post("/logout", logout)
router.get("/profile", authRequired , profile);
router.get("/verify", verifyToken);
router.post("/adduser", validateSchema(resgisterSchema), authRequired, verifyRole(['superadmin']), addUser)
router.get("/getuser", authRequired, verifyRole(['superadmin']), getUser)
router.delete("/deleteuser/:id", authRequired, verifyRole(['superadmin']), deleteUser)

export default router