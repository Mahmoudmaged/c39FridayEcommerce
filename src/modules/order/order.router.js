import { auth, roles } from '../../middleware/auth.js';
import * as orderController from './controller/order.js'
import { Router } from "express";
import { endpoint } from './order.endPoint.js';
const router = Router()




router.post("/",
    auth(endpoint.create),
    orderController.createOrder)


router.patch("/:orderId",
    auth(endpoint.create),
    orderController.cancelOrder)

// router.patch("/:orderId/delivered",
//     auth(endpoint.deliveredOrder),
//     orderController.deliveredOrder)




export default router