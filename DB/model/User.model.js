import mongoose, { Schema, model } from "mongoose";


const userSchema = new Schema({

    firstName: String,
    lastName: String,
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    image: Object,
    DOB: String,
    address: String,
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female']
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },


    confirmEmail: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        default: 'offline',
        enum: ['offline', 'online', 'blocked']
    },
    code: {
        type: Number,
        default: null
    },
    changePasswordTime :Date

}, {
    timestamps: true
})


const userModel = mongoose.models.User || model('User', userSchema)
export default userModel