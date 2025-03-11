import { Router } from "express";
import multer from 'multer';
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { createIdealStock, getIdealStocks, checkDataExists, pedidoStock, enviarPedidoStock, updatedIdealStock } from "../controller/stockIdeal.controller.js";

const router = Router()
const upload = multer({ dest: 'uploads/' });

router.post('/addstockideal', upload.single('file'),  createIdealStock)
router.get('/stockideal', authRequired, verifyRole(['admin','superadmin']), getIdealStocks)
router.get('/checkdata', authRequired, verifyRole(['admin','superadmin']), checkDataExists)
router.get('/pedidorecomendado', authRequired, verifyRole(['admin','superadmin']), pedidoStock)
router.get('/sendorder', enviarPedidoStock)
router.put('/editstock', authRequired, verifyRole(['superadmin', 'admin']), updatedIdealStock)
export default router