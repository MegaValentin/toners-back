import { Router } from "express";
import { getToners, getToner,getLowToner, deleteToner, updatedToner, addToners, postReStock, restockAllPost, addAllToners, lowTonerStock, reportToners} from "../controller/toners.controller.js";
import { createTonerSchema } from "../schemas/toners.schemas.js"
import { validateSchema } from "../middleware/validator.middleware.js";
import multer from 'multer';
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";

const router = Router()
const upload = multer({ dest: 'uploads/' });

router.get('/toners', authRequired, verifyRole(['admin','superadmin', 'empleado']), getToners)

router.get('/toner/:id', authRequired, verifyRole(['admin','superadmin']), getToner)

router.get('/low-toner', authRequired, verifyRole(['admin','superadmin']), lowTonerStock)

router.delete('/toner/:id', authRequired, verifyRole(['admin','superadmin']), deleteToner)

router.put('/toner/:id', authRequired, verifyRole(['admin','superadmin']), updatedToner )

router.post('/addtoners',validateSchema(createTonerSchema), authRequired, verifyRole(['admin','superadmin']), addToners)

router.post('/restock', authRequired, verifyRole(['admin','superadmin']), postReStock)

router.post('/restockall', authRequired, verifyRole(['admin','superadmin']), restockAllPost)

router.post('/addalltoners', upload.single('file'), addAllToners)

router.get('/lowstock', lowTonerStock)

router.get('/report/toner', authRequired, verifyRole(['admin','superadmin']), reportToners)

export default router