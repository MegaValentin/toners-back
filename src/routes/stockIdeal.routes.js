import { Router } from "express";
import multer from 'multer';
import { createIdealStock, getIdealStocks, checkDataExists, pedidoStock, enviarPedidoStock } from "../controller/stockIdeal.controller.js";

const router = Router()
const upload = multer({ dest: 'uploads/' });

router.post('/addstockideal', upload.single('file'), createIdealStock)
router.get('/stockideal', getIdealStocks)
router.get('/checkdata', checkDataExists)
router.get('/pedidorecomendado', pedidoStock)
router.post('/sendorder', enviarPedidoStock)
export default router