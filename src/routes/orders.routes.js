import { Router } from "express";
import { getOrders, getOrder, deleteOrder, addOrders } from "../controller/orders.controller.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import { createOrderSchema } from "../schemas/orders.schemas.js"

const router = Router()

router.get('/orders', getOrders)

router.get('/order/:id', getOrder)

router.delete('/order/:id', deleteOrder)

router.post('/addorders', validateSchema(createOrderSchema),  addOrders)

export default router