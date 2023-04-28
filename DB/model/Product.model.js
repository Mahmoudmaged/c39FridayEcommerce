
import mongoose, { Schema, Types, model } from "mongoose";


const productSchema = new Schema({
    customId: { type: String },
    name: { type: String, required: true, trim: true, lower: true },
    slug: { type: String, required: true, trim: true, lower: true },
    description: { type: String, trim: true },
    colors: [String],
    size: [String],
    stock: { type: Number, default: 1, required: true },

    price: { type: Number, default: 1, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 1, required: true },


    mainImage: { type: Object, required: true },
    subImages: { type: [Object] },

    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    subcategoryId: { type: Types.ObjectId, ref: 'Subcategory', required: true },
    brandId: { type: Types.ObjectId, ref: 'Brand', required: true },

    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },

    // rating: {
    //     total: { type: Number, default: 0 },
    //     count: { type: Number, default: 0 },
    //     avgRating: { type: Number, default: 0 },
    // },
    wishUsers: [{ type: Types.ObjectId, ref: 'User' }]

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
})


productSchema.virtual('review', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId'
})
const productModel = mongoose.models.Product || model("Product", productSchema)
export default productModel
