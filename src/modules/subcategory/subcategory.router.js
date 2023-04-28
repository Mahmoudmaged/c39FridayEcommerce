import * as subcategoryController from './controller/subcategory.js'
import * as validators from './subcategory.validation.js'
import { validation } from '../../middleware/validation.js';
import { fileUpload, fileValidation } from '../../utils/multer.js';
import { Router } from "express";
import { auth } from '../../middleware/auth.js';
import { endpoint } from './subcategory.endPoint.js';
const router = Router({ mergeParams: true })



router.get("/", subcategoryController.getSubcategory)


router.post("/",
    auth(endpoint.create),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.createSubcategory),
    subcategoryController.createSubcategory)


router.put("/:subcategoryId",
    auth(endpoint.update),
    fileUpload(fileValidation.image).single('image'),
    validation(validators.updateSubcategory),
    subcategoryController.updateSubcategory)

export default router