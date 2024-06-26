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
router.post("/adduser", validateSchema(resgisterSchema), authRequired, verifyRole(['admin']), addUser)
router.get("/getuser", authRequired, verifyRole(['admin']), getUser)
router.delete("/deleteuser/:id", authRequired, verifyRole(['admin']), deleteUser)

export default router