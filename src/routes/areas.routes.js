import { Router } from "express";
import {
    getOffices,
    getOffice,
    deleteOffice,
    updateOffice,
    addOffice } from "../controller/areas.controller.js";

const router = Router()

router.get('/offices', getOffices)

router.get('/office', getOffice)

router.delete('/office/:id', deleteOffice)

router.put('office/:id', updateOffice )

router.post('/addoffice', addOffice)

export default router