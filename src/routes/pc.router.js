import { Router } from "express"
import { authRequired } from "../middleware/validator.token.js"
import { verifyRole } from "../middleware/validator.role.js"
import { getPCs, addPC, assignPc, deletePC, getMyPC, completePC, revertPC, generatePCReport } from "../controller/pc.controller.js"

const router = Router()

router.get('/pcs', authRequired, verifyRole(['admin', 'superadmin']), getPCs)
router.post('/addpc', authRequired, verifyRole(['admin', 'superadmin']), addPC)
router.delete('/pc/:id', authRequired, verifyRole(['admin', 'superadmin']), deletePC)
router.put('/pc/:id', authRequired, verifyRole(['admin', 'superadmin']), getPC)
router.get('/pcs', authRequired, verifyRole(['admin', 'superadmin']), getPC)
router.get('/pcs', authRequired, verifyRole(['admin', 'superadmin']), getPC)
export default router