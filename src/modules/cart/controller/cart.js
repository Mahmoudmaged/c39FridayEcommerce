import productModel from '../../../../DB/model/Product.model.js'
import cartModel from '../../../../DB/model/Cart.model.js'
import { asyncHandler } from '../../../utils/errorHandling.js'








export const addToCart = async (req, res, next) => {
    const { productId, quantity } = req.body
    //Check product availability
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error("In-valid product Id", { cause: 404 }))
    }
    if (product.stock < quantity || product.isDeleted) {
        await productModel.updateOne({ _id: productId }, { $addToSet: { wishUsers: req.user._id } })
        return next(new Error("product quantity not available now", { cause: 404 }))
    }

    // check cart
    const cart = await cartModel.findOne({ userId: req.user._id })
    // if cart  not exist
    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            products: [{ productId, quantity }]
        })

        return res.status(201).json({ message: "Done", cart: newCart })
    }

    // update item
    let matchItem = false;
    for (let i = 0; i < cart.products.length; i++) {
        if (cart.products[i].productId.toString() == productId) {
            cart.products[i].quantity = quantity;
            matchItem= true
            break;
        }
    }
    //push new item
    if (!matchItem) {
        cart.products.push({productId , quantity})
    }

    await cart.save()
    return res.status(200).json({ message: "Done", cart })
}


export async function deleteItemsFromCart(productIds, userId) {
    const cart = await cartModel.updateOne({ userId }, {
        $pull: {
            products: {
                productId: { $in: productIds }
            }
        }
    })
    return cart
}

export const deleteItems = asyncHandler(async (req, res, next) => {
    const { productIds } = req.body
    const cart = await deleteItemsFromCart(productIds, req.user._id)
    return res.status(200).json({ message: "Done", cart })
})

export async function emptyCart(userId) {
    const cart = await cartModel.updateOne({ userId }, { products: [] })
    return cart
}


export const clearCart = asyncHandler(async (req, res, next) => {
    const cart = await emptyCart(req.user._id)
    return res.status(200).json({ message: "Done", cart })
})