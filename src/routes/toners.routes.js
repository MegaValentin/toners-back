import { Router } from "express";
import { docRecommendedTonersOrdersWord, docRecommendedTonersOrders, getToners, getToner, deleteToner, updatedToner, addToners, postReStock, restockAllPost, addAllToners, reportToners, getRecommendedOrders, getLowStockToners} from "../controller/toners.controller.js";
import { createTonerSchema } from "../schemas/toners.schemas.js"
import { validateSchema } from "../middleware/validator.middleware.js";
import multer from 'multer';
import { authRequired } from "../middleware/validator.token.js";
import { verifyRole } from "../middleware/validator.role.js";

const router = Router()
const upload = multer({ dest: 'uploads/' });

router.get('/toners', authRequired, verifyRole(['admin','superadmin', 'empleado']), getToners)

router.get('/toner/:id', authRequired, verifyRole(['admin','superadmin']), getToner)

router.delete('/toner/:id', authRequired, verifyRole(['admin','superadmin']), deleteToner)

router.put('/toner/:id', authRequired, verifyRole(['admin','superadmin']), updatedToner )

router.post('/addtoners',validateSchema(createTonerSchema), authRequired, verifyRole(['admin','superadmin']), addToners)

router.post('/restock', authRequired, verifyRole(['admin','superadmin']), postReStock)

router.post('/restockall', authRequired, verifyRole(['admin','superadmin']), restockAllPost)

router.post('/addalltoners', upload.single('file'), addAllToners)

router.get('/report/toner', authRequired, verifyRole(['admin','superadmin']), reportToners)

router.get('/recommended',authRequired, verifyRole(['admin','superadmin']), getRecommendedOrders)

router.get('/lowstock', getLowStockToners)

router.get('/recommendes/doc', authRequired, verifyRole(['admin', 'superadmin']), docRecommendedTonersOrders)

router.get('/recommendes/word', authRequired, verifyRole(['admin', 'superadmin']), docRecommendedTonersOrdersWord)

export default router