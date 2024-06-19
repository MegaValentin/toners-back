import { Router } from "express";
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";
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

router.get('/offices', authRequired, verifyRole(['admin']), getOffices)

router.get('/office/:id', authRequired, verifyRole(['admin']), getOffice)

router.delete('/office/:id', authRequired, verifyRole(['admin']), deleteOffice)

router.put('/office/:id', authRequired, verifyRole(['admin']), updatedOffice )

router.post('/addoffice',validateSchema(createAreaSchema), authRequired, verifyRole(['admin']), addOffice)

router.post('/addalloffice', upload.single('file'), authRequired, verifyRole(['admin']), addAllOfiice)

export default router