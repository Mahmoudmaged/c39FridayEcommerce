
import * as productController from './controller/product.js'
import * as validators from './product.validation.js'
import reviewRouter from '../reviews/reviews.router.js'
import { validation } from '../../middleware/validation.js';
import { fileUpload, fileValidation } from '../../utils/multer.js';
import { auth } from '../../middleware/auth.js';
import { endpoint } from './product.endPoint.js';
import { Router } from "express";

const router = Router()


router.use('/:productId/review' , reviewRouter)

router.get("/" , productController.getProducts)
router.post("/",
    validation(validators.headers, true),
    auth(endpoint.create),
    fileUpload(fileValidation.image).fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },

    ]),
    validation(validators.create),
    productController.createProduct)


router.put("/:productId",
    auth(endpoint.update),
    fileUpload(fileValidation.image).fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },

    ]),
    validation(validators.update),
    productController.updateProduct)



export default router