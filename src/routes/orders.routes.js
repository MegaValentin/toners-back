import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import { getOrders,
    getOrder,
    deleteOrder,
    addOrders,
    getAreaUsage,
    deliveryToner, 
    getMonthlyReport,
    getYearlyReport,
    generateOrdersReport,
    cancelOrder,
    removeUndeliveredOrder} from "../controller/orders.controller.js";

const router = Router()

router.get('/orders', authRequired, verifyRole(['admin', 'empleado','superadmin']), getOrders)

router.get('/order/:id',authRequired, verifyRole(['admin','superadmin']), getOrder)

router.get('/history', authRequired, verifyRole(['admin','superadmin']), getAreaUsage)

router.delete('/order/:id',authRequired, verifyRole(['admin','superadmin']), deleteOrder)

router.post('/addorders', authRequired, verifyRole(['admin', 'empleado','superadmin']),  addOrders)

router.put('/orders/:id/deliver',authRequired, verifyRole(['admin', 'empleado','superadmin']), deliveryToner)

router.get('/report/monthly', authRequired, verifyRole(['admin','superadmin']),getMonthlyReport)

router.get('/report/yearly', authRequired, verifyRole(['admin','superadmin']), getYearlyReport)

router.post('/cancel/:id', authRequired, verifyRole(['admin','superadmin']), cancelOrder)

router.delete('/remove/:id', authRequired, verifyRole(['admin','superadmin']), removeUndeliveredOrder)

router.get('/orders/report', authRequired, verifyRole(['admin','superadmin']), generateOrdersReport)

export default router