import { Router } from "express";
import { getToners, getToner,getLowToner, deleteToner, updatedToner, addToners, postReStock, restockAllPost, addAllToners} from "../controller/toners.controller.js";
import { createTonerSchema } from "../schemas/toners.schemas.js"
import { validateSchema } from "../middleware/validator.middleware.js";
import multer from 'multer';
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";

const router = Router()
const upload = multer({ dest: 'uploads/' });

router.get('/toners', authRequired, verifyRole(['admin', 'empleado']), getToners)

router.get('/toner/:id', authRequired, verifyRole(['admin']), getToner)

router.get('/low-toner', authRequired, verifyRole(['admin']), getLowToner)

router.delete('/toner/:id', authRequired, verifyRole(['admin']), deleteToner)

router.put('/toner/:id', authRequired, verifyRole(['admin']), updatedToner )

router.post('/addtoners',validateSchema(createTonerSchema), authRequired, verifyRole(['admin']), addToners)

router.post('/restock', authRequired, verifyRole(['admin']), postReStock)

router.post('/restockall', authRequired, verifyRole(['admin']), restockAllPost)

router.post('/addalltoners', upload.single('file'), addAllToners)

export default router