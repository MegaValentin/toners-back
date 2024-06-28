import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { getOrders, getOrder, deleteOrder, addOrders, getAreaUsage, deliveryToner} from "../controller/orders.controller.js";

const router = Router()

router.get('/orders', authRequired, verifyRole(['admin', 'empleado']), getOrders)

router.get('/order/:id',authRequired, verifyRole(['admin']), getOrder)

router.get('/history', authRequired, verifyRole(['admin']), getAreaUsage)

router.delete('/order/:id',authRequired, verifyRole(['admin']), deleteOrder)

router.post('/addorders', authRequired, verifyRole(['admin', 'empleado']),  addOrders)

router.put('/orders/:id/deliver',authRequired, verifyRole(['admin', 'empleado']), deliveryToner)

export default router