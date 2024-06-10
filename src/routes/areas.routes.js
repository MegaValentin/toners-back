import { Router } from "express";
import {
    getOffices,
    getOffice,
    deleteOffice,
    updatedOffice,
    addOffice,
    addAllOfiice} from "../controller/areas.controller.js";
import { validateSchema } from "../middleware/validator.middleware.js";
import { createAreaSchema } from "../schemas/areas.schemas.js"
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router()

router.get('/offices', getOffices)

router.get('/office/:id', getOffice)

router.delete('/office/:id', deleteOffice)

router.put('/office/:id', updatedOffice )

router.post('/addoffice',validateSchema(createAreaSchema), addOffice)

router.post('/addalloffice', upload.single('file'), addAllOfiice)

export default router