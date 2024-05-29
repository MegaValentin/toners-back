import { Router } from "express";
import { getOrders, getOrder, deleteOrder, addOrders } from "../controller/orders.controller.js";



const router = Router()

router.get('/orders', getOrders)

router.get('/order/:id', getOrder)

router.delete('/order/:id', deleteOrder)

router.post('/addorders',  addOrders)

export default router