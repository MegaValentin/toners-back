import { Router } from "express";
import { getOrders, getOrder, deleteOrder, addOrders } from "../controller/orders.controller.js";

const router = Router()

router.get('/orders', getOrders)

router.get('/toner', getOrder)

router.delete('/toner/:id', deleteOrder)

router.post('/addtoners', addOrders)

export default router