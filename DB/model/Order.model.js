
import mongoose, { Schema, Types, model } from "mongoose";


const orderSchema = new Schema({

    userId: { type: Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    phone: {
        type: [String],
        required: true
    },
    note: String,
    products: [
        {
            name: { type: String, required: true },
            productId: { type: Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, required: true },
            unitPrice: { type: Number, default: 1, required: true },
            finalPrice: { type: Number, default: 1, required: true }

        }
    ],
    
    couponId: { type: Types.ObjectId, ref: 'Coupon' },
    subtotal: { type: Number, default: 1, required: true },
    finalPrice: { type: Number, default: 1, required: true },
    paymentType: {
        type: String,
        default: 'cash',
        enum: ['cash', 'card']
    },
    status: {
        type: String,
        default: 'placed',
        enum: ['waitPayment', 'placed', 'canceled', 'onWay', 'delivered', 'rejected']
    },
    reason: String,
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false }

}, {
    timestamps: true
})


const orderModel = mongoose.models.Order || model("Order", orderSchema)
export default orderModel
