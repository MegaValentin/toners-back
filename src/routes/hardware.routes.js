import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import {
  getHardwares,
  getHardware,
  deleteHardware,
  addHardwares,
  confirmOrderHardware
} from "../controller/hardware.controller.js";
const router = Router();

router.get("/hardwares", authRequired, getHardwares);
router.get("/hardware/:id", authRequired, getHardware);
router.post("/addhardware", authRequired, addHardwares);
router.delete("/hardware/:id", authRequired, deleteHardware);
router.put("/hardware/:id", authRequired, confirmOrderHardware);


export default router