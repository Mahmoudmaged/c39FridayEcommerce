import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const createReview = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const { comment, rating } = req.body;
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error("In-valid productId", { cause: 400 }))
    }

    const order = await orderModel.findOne({
        userId: req.user._id,
        status: 'delivered',
        "products.productId": productId
    })
    if (!order) {
        return next(new Error(`cannot review product before you get it`, { cause: 400 }))
    }

    if (await reviewModel.findOne({ createdBy: req.user._id, productId })) {
        return next(new Error(`Already  reviewed by you`, { cause: 400 }))
    }

    await reviewModel.create({ createdBy: req.user._id, orderId: order._id, productId, comment, rating })

    // product.rating.total += rating;
    // product.rating.count++;
    // product.rating.avgRating = parseFloat((product.rating.total / product.rating.count).toFixed(1));
    // await product.save()
    return res.status(201).json({ message: "Done" })


    //20 -5 + 4

})

export const updateReview = asyncHandler(async (req, res, next) => {
    const { productId, reviewId } = req.params;
    const review = await reviewModel.findOneAndUpdate({ _id: reviewId, productId, createdBy: req.user._id }, req.body)
    return res.status(201).json({ message: "Done" , review })
})