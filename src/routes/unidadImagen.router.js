import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { getUnidadImagen ,getUni, updatedUni, reportUni, addUni, deleteUni} from "../controller/unidadImagen.controller.js";
const router = Router()

router.get('/unidadImagen', authRequired, verifyRole(['admin','superadmin']),getUnidadImagen)

router.get('/unidadImagen/:id', authRequired, verifyRole(['admin','superadmin']),getUni)

router.get('low-unidadImagen', authRequired, verifyRole(['admin','superadmin']))

router.delete('/unidadImagen/:id', authRequired, verifyRole(['admin','superadmin']), deleteUni)

router.put('/unidadImagen/:id', authRequired, verifyRole(['admin','superadmin']),updatedUni)

router.post('/add-unidadImagen', authRequired, verifyRole(['admin','superadmin']), addUni)

router.post('restock-unidadImagen', authRequired, verifyRole(['admin','superadmin']))

router.get('/report/unidadImagen', authRequired, verifyRole(['admin','superadmin']),reportUni)