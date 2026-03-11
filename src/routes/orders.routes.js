import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import {
  getOrders,
  getOrder,
  deleteOrder,
  addOrders,
  getAreaUsage,
  deliveryToner,
  cancelOrder,
  removeUndeliveredOrder,
  generateReportComplet
} from "../controller/orders.controller.js";

import {
  getOrdersUni,
  getOrderUni,
  deleteOrderUni,
  deliveryUni,
  addOrdersUni,
  cancelOrderUni,
  removeUndeliveredOrderUni
} from "../controller/ordersuni.controller.js";
const router = Router();

router.get(
  "/orders",
  authRequired,
  verifyRole(["admin", "empleado", "superadmin"]),
  getOrders
);

router.get(
  "/orderuni",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  getOrdersUni
);

router.get(
  "/order/:id",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  getOrder
);

router.get(
  "/orderuni/:id",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  getOrderUni
);

router.get(
  "/history",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  getAreaUsage
);

router.get("/historyuni", authRequired, verifyRole(["admin", "superadmin"]));

router.delete(
  "/order/:id",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  deleteOrder
);

router.delete(
  "/orderuni/:id",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  deleteOrderUni
);

router.post(
  "/addorders",
  authRequired,
  verifyRole(["admin", "empleado", "superadmin"]),
  addOrders
);

router.post(
  "/addordersuni",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  addOrdersUni
);

router.put(
  "/orders/:id/deliver",
  authRequired,
  verifyRole(["admin", "empleado", "superadmin"]),
  deliveryToner
);

router.put(
  "/orderuni/:id/deliver",
  authRequired,
  verifyRole(["admin", "empleado", "superadmin"]),
  deliveryUni
);

router.get(
  "/reportuni/monthly",
  authRequired,
  verifyRole(["admin", "superadmin"])
);

router.get(
  "/reportuni/yearly",
  authRequired,
  verifyRole(["admin", "superadmin"])
);

router.post(
  "/cancel/:id",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  cancelOrder
);

router.post(
  "/cancel/:id",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  cancelOrderUni
);

router.delete(
  "/remove/:id",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  removeUndeliveredOrder
);

router.delete(
  "/removeuni/:id",
  authRequired,
  verifyRole(["admin", "superadmin"]),
  removeUndeliveredOrderUni
);

router.get(
  "/orderuni/report",
  authRequired,
  verifyRole(["admin", "superadmin"])
);

router.get("/generate-report", authRequired,
verifyRole(["admin", "superadmin"]),
generateReportComplet)
export default router;
