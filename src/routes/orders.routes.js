import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { getOrders, getOrder, deleteOrder, addOrders, getAreaUsage} from "../controller/orders.controller.js";

const router = Router()

router.get('/orders', authRequired, verifyRole(['admin', 'empleado']), getOrders)

router.get('/order/:id',authRequired, verifyRole(['admin']), getOrder)

router.get('/history', authRequired, verifyRole(['admin']), getAreaUsage)

router.delete('/order/:id',authRequired, verifyRole(['admin']), deleteOrder)

router.post('/addorders', authRequired, verifyRole(['admin', 'empleado']),  addOrders)

export default router