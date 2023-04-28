import { asyncHandler } from "../../../utils/errorHandling.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from 'slugify'


export const getBrand = asyncHandler(async (req, res, next) => {
    const brand = await brandModel.find({
        isDeleted: false
    })
    return res.status(200).json({ message: "Done", brandList: brand })
})


export const createBrand = asyncHandler(async (req, res, next) => {
    req.body.name = req.body.name.toLowerCase()
    if (await brandModel.findOne({ name: req.body.name })) {
        return res.status(409).json({ message: `Duplicated brand name ${req.body.name}` })
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` })
    req.body.image = { secure_url, public_id }
    req.body.createBy = req.user._id
    const brand = await brandModel.create(req.body)
    return res.status(201).json({ message: "Done", brand })
})


export const updateBrand = asyncHandler(async (req, res, next) => {


    const { brandId } = req.params;
    const brand = await brandModel.findById(brandId)
    if (!brand) {
        return next(new Error('In-valid brand Id', { cause: 400 }))
    }

    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == brand.name) {
            return next(new Error('Can not updated brand with the same old name', { cause: 400 }))

        }
        if (await brandModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated brand name ${req.body.name}`, { cause: 409 }))

        }
        brand.name = req.body.name
    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/brand` })
        await cloudinary.uploader.destroy(brand.image?.public_id) // delete old pic
        brand.image = { secure_url, public_id }

    }

    brand.updatedBy = req.user._id
    await brand.save();
    return res.status(200).json({ message: "Done", brand })
})