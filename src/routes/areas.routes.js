import { Router } from "express";
import {
    getOffices,
    getOffice,
    deleteOffice,
    updatedOffice,
    addOffice } from "../controller/areas.controller.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import { createAreaSchema } from "../schemas/areas.schemas.js"

const router = Router()

router.get('/offices', getOffices)

router.get('/office/:id', getOffice)

router.delete('/office/:id', deleteOffice)

router.put('/office/:id', updatedOffice )

router.post('/addoffice',validateSchema(createAreaSchema), addOffice)

export default router