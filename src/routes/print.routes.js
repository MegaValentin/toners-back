import { Router } from "express"
import { authRequired } from "../middleware/validator.token.js"
import { verifyRole } from "../middleware/validator.role.js"
import { getPrint, getPrints, deletePrint, addPrint, getListPrint, updatedPrint } from "../controller/print.controller.js"

const router = Router()

router.get('/prints', authRequired, verifyRole(['admin', 'superadmin', 'empleado']), getPrints )

router.get('/print', authRequired, verifyRole(['admin', 'superadmin', 'empleado']), getPrint )

router.delete('/print/:id', authRequired, verifyRole(["admin", "superadmin", "empleado"]), deletePrint)

router.put('/print/:id', authRequired, verifyRole(["admin", "superadmin", "empleado"]), updatedPrint)

router.post('/addprint', authRequired, verifyRole([ "admin", "superadmin", "empleado"]), addPrint)

router.get('/listprint/:tonerId', authRequired, verifyRole(["admin", "superadmin", "empleado"]), getListPrint)

export default router
