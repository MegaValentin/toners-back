import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";

const router = Router()

router.get('/unidadImagen', authRequired, verifyRole(['admin']))

router.get('/unidadImagen/:id', authRequired, verifyRole(['admin']))

router.get('low-unidadImagen', authRequired, verifyRole(['admin']))

router.delete('/unidadImagen/:id', authRequired, verifyRole(['admin']))

router.put('/unidadImagen/:id', authRequired, verifyRole(['admin']))

router.post('/add-unidadImagen', authRequired, verifyRole(['admin']))

router.post('restock-unidadImagen', authRequired, verifyRole(['admin']))

router.get('/report/unidadImagen', authRequired, verifyRole(['admin']))