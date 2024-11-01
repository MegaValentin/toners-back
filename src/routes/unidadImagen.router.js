import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { getUnidadImagen ,getUni, updatedUni, reportUni, addUni, deleteUni} from "../controller/unidadImagen.controller.js";
const router = Router()

router.get('/uni', authRequired, verifyRole(['admin','superadmin']),getUnidadImagen)

router.get('/uni/:id', authRequired, verifyRole(['admin','superadmin']),getUni)

router.get('lowuni', authRequired, verifyRole(['admin','superadmin']))

router.delete('/uni/:id', authRequired, verifyRole(['admin','superadmin']), deleteUni)

router.put('/uni/:id', authRequired, verifyRole(['admin','superadmin']),updatedUni)

router.post('/adduni', authRequired, verifyRole(['admin','superadmin']), addUni)

router.post('restockuni', authRequired, verifyRole(['admin','superadmin']))

router.get('/report/unidadImagen', authRequired, verifyRole(['admin','superadmin']),reportUni)

export default router