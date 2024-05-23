import { Router } from "express";
import { getToners, getToner, deleteToner, updatedToner, addToners } from "../controller/toners.controller.js";
const router = Router()

router.get('/toners', getToners)

router.get('/toner/:id', getToner)

router.delete('/toner/:id', deleteToner)

router.put('/toner/:id', updatedToner )

router.post('/addtoners', addToners)

export default router