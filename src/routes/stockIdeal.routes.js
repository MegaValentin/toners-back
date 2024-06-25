import { Router } from "express";
import multer from 'multer';
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { createIdealStock, getIdealStocks, checkDataExists, pedidoStock, enviarPedidoStock } from "../controller/stockIdeal.controller.js";

const router = Router()
const upload = multer({ dest: 'uploads/' });

router.post('/addstockideal', upload.single('file'), authRequired, verifyRole(['admin']), createIdealStock)
router.get('/stockideal', authRequired, verifyRole(['admin']), getIdealStocks)
router.get('/checkdata', authRequired, verifyRole(['admin']), checkDataExists)
router.get('/pedidorecomendado', authRequired, verifyRole(['admin']), pedidoStock)
router.post('/sendorder', enviarPedidoStock)
export default router