import { Router } from "express";
import {
    getOffices,
    getOffice,
    deleteOffice,
    updatedOffice,
    addOffice } from "../controller/areas.controller.js";

const router = Router()

router.get('/offices', getOffices)

router.get('/office/:id', getOffice)

router.delete('/office/:id', deleteOffice)

router.put('/office/:id', updatedOffice )

router.post('/addoffice', addOffice)

export default router