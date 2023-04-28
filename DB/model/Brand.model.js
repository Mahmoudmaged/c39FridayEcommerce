import mongoose, { Schema, Types, model } from "mongoose";


const brandSchema = new Schema({

    name: { type: String, required: true, trim: true, unique: true, lower: true },
    image: { type: Object, required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User' },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }

}, {
    timestamps: true
})


const brandModel = mongoose.models.Brand || model("Brand", brandSchema)
export default brandModel
