import { Router } from "express";
import { getOrders, getOrder, deleteOrder, addOrders } from "../controller/orders.controller.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import { createAreaSchema } from "../schemas/orders.schemas.js"

const router = Router()

router.get('/orders', getOrders)

router.get('/order/:id', getOrder)

router.delete('/order/:id', deleteOrder)

router.post('/addorders', validateSchema(createAreaSchema),  addOrders)

export default router