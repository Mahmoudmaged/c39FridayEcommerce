import mongoose, { Schema, Types, model } from "mongoose";


const subcategorySchema = new Schema({

    name: { type: String, required: true, trim: true, unique: true , lower: true  },
    slug: { type: String, required: true  , lower: true },
    image: { type: Object, required: true },
    categoryId: { type: Types.ObjectId, ref: 'Category', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }

}, {
    timestamps: true
})

const subcategoryModel = mongoose.models.Subcategory || model("Subcategory", subcategorySchema)
export default subcategoryModel
