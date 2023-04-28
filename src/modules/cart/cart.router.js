import { auth } from '../../middleware/auth.js';
import { endpoint } from './cart.endPoint.js';
import * as cartController from './controller/cart.js'
import * as validators  from './cart.validation.js'
import { validation } from '../../middleware/validation.js'
import { Router } from "express";
const router = Router()




router.post('/',
    auth(endpoint.addToCart),
    validation(validators.addToCart),
    cartController.addToCart)




export default router