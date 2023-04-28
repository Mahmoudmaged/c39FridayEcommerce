import { Router } from "express";
import { endpoint } from "./reviews.endPoint.js";
import * as reviewController from './controller/review.js'
import { auth } from "../../middleware/auth.js";
const router = Router({ mergeParams: true })




router.post("/",
    auth(endpoint.create),
    reviewController.createReview)


router.put("/:reviewId",
    auth(endpoint.update),
    reviewController.updateReview)




export default router