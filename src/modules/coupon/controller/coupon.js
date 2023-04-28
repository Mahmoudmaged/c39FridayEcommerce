import { asyncHandler } from "../../../utils/errorHandling.js";
import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from 'slugify'


export const getCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await couponModel.find({
        isDeleted: false
    })
    return res.status(200).json({ message: "Done", couponList: coupon })
})


export const createCoupon = asyncHandler(async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase()
    if (await couponModel.findOne({ name: req.body.name })) {
        return next(new Error('Duplicated coupon name', { cause: 409 }))

    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
        req.body.image = { secure_url, public_id }
    }

    req.body.expire = new Date(req.body.expire)
    req.body.createdBy = req.user._id
    const coupon = await couponModel.create(req.body)
    return res.status(201).json({ message: "Done", coupon })
})


export const updateCoupon = asyncHandler(async (req, res, next) => {


    const { couponId } = req.params;
    const coupon = await couponModel.findById(couponId)
    if (!coupon) {
        return next(new Error('In-valid coupon Id', { cause: 400 }))
    }

    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == coupon.name) {
            return next(new Error('Can not updated coupon with the same old name', { cause: 400 }))

        }
        if (await couponModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated coupon name ${req.body.name}`, { cause: 409 }))

        }

    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/coupon` })
        if (coupon.image?.public_id) {
            await cloudinary.uploader.destroy(coupon.image?.public_id) // delete old pic
        }
        req.body.image = { secure_url, public_id }

    }

    if (req.body.expire) {
        req.body.expire = new Date(req.body.expire)
    }

    req.body.updatedBy = req.user._id
    await couponModel.updateOne({ _id: couponId }, req.body)
    return res.status(200).json({ message: "Done", coupon })
})