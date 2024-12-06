import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
import {
  getHardwares,
  getHardware,
  deleteHardware,
  addHardwares,
  confirmOrderHardware
} from "../controller/hardware.controller.js";
const router = Router();

router.get("/hardwares", authRequired, verifyRole(['admin','superadmin']), getHardwares);

router.get("/hardware/:id", authRequired,verifyRole(['admin','superadmin']),  getHardware);

router.post("/addhardware", authRequired, verifyRole(['admin','superadmin']),addHardwares);

router.delete("/hardware/:id", authRequired,verifyRole(['admin','superadmin']), deleteHardware);

router.put("/hardware/:id", authRequired,verifyRole(['admin','superadmin']), confirmOrderHardware);


export default router