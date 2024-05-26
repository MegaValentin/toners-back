import { Router } from "express";
import { getToners, getToner, deleteToner, updatedToner, addToners } from "../controller/toners.controller.js";
import { createTonerSchema } from "../schemas/toners.schemas.js"
import { validateSchema } from "../middleware/validator.middleware.js";
const router = Router()

router.get('/toners', getToners)

router.get('/toner/:id', getToner)

router.delete('/toner/:id', deleteToner)

router.put('/toner/:id', updatedToner )

router.post('/addtoners',validateSchema(createTonerSchema), addToners)

export default router