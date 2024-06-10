import { Router } from "express";
import { getToners, getToner,getLowToner, deleteToner, updatedToner, addToners, postReStock, restockAllPost, addAllToners} from "../controller/toners.controller.js";
import { createTonerSchema } from "../schemas/toners.schemas.js"
import { validateSchema } from "../middleware/validator.middleware.js";
import multer from 'multer';

const router = Router()
const upload = multer({ dest: 'uploads/' });

router.get('/toners', getToners)

router.get('/toner/:id', getToner)

router.get('/low-toner', getLowToner)

router.delete('/toner/:id', deleteToner)

router.put('/toner/:id', updatedToner )

router.post('/addtoners',validateSchema(createTonerSchema), addToners)

router.post('/restock', postReStock)

router.post('/restockall', restockAllPost)

router.post('/addalltoners', upload.single('file'), addAllToners)

export default router