import mongoose, { Schema, Types, model } from "mongoose";


const categorySchema = new Schema({

    name: { type: String, required: true, trim: true, unique: true , lower: true  },
    slug: { type: String, required: true , lower: true  },
    image: { type: Object, required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

categorySchema.virtual('subcategory', {
    localField: "_id",
    foreignField: 'categoryId',
    ref: 'Subcategory'
})

const categoryModel = mongoose.models.Category || model("Category", categorySchema)
export default categoryModel
