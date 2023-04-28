import slugify from "slugify"
import brandModel from "../../../../DB/model/Brand.model.js"
import subcategoryModel from "../../../../DB/model/Subcategory.model.js"
import cloudinary from "../../../utils/cloudinary.js";
import { nanoid } from "nanoid";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { paginate } from "../../../utils/paginate.js";
import ApiFeatures from "../../../utils/apiFesatures.js";

export const getProducts = asyncHandler(async (req, res, next) => {


    const apiFeature = new ApiFeatures(productModel.find().populate([{
        path:'review'
    }]), req.query).filter().sort().paginate().search().select()
    const products = await apiFeature.mongooseQuery;

    for (let i = 0; i < products.length; i++) {
        let calcRating = 0
        for (let j = 0; j < products[i].review.length; j++) {
            calcRating += products[i].review[j].rating
        }
        const convObject = products[i].toObject()
        convObject.avgRating = calcRating / products[i].review.length;
        products[i] = convObject

    }
    return res.status(200).json({ message: "Done", products })

})

export const createProduct = async (req, res, next) => {
    const { name, categoryId, subcategoryId, brandId, price, discount } = req.body

    //check categoryId  , subCategory and brand
    if (!await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
        return next(new Error("In-valid subcategory or category Id", { cause: 400 }))
    }
    if (!await brandModel.findById(brandId)) {
        return next(new Error("In-valid brand Id", { cause: 400 }))
    }
    //handel slug
    req.body.slug = slugify(name, {
        replacement: '-',
        trim: true,
        lower: true
    })
    //handel final price
    req.body.finalPrice = price - (price * ((discount || 0) / 100)) // price*((100-50)/100)

    //handel images
    req.body.customId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}` })
    req.body.mainImage = { secure_url, public_id }

    if (req.files?.subImages?.length) {
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
                { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_id })
        }
    }

    req.body.createdBy = req.user._id

    const product = await productModel.create(req.body);
    return res.status(201).json({ message: "Done", product })
}

export const updateProduct = async (req, res, next) => {
    const { productId } = req.params
    const product = await productModel.findById(productId)
    if (!product) {
        return next(new Error("In-valid product Id", { cause: 400 }))
    }
    const { name, categoryId, subcategoryId, brandId, price, discount } = req.body

    //check categoryId  , subCategory and brand
    if (categoryId && subcategoryId) {
        if (!await subcategoryModel.findOne({ _id: subcategoryId, categoryId })) {
            return next(new Error("In-valid subcategory or category Id", { cause: 400 }))
        }
    }
    if (brandId) {
        if (!await brandModel.findById(brandId)) {
            return next(new Error("In-valid brand Id", { cause: 400 }))
        }
    }
    //handel slug
    if (name) {
        req.body.slug = slugify(name, {
            replacement: '-',
            trim: true,
            lower: true
        })
    }

    //handel final price
    req.body.finalPrice = (price || product.price) - ((price || product.price) * ((discount || product.discount) / 100))

    // if (price && discount) {
    //     req.body.finalPrice = price || product.price - (price || product.price * (discount || product.discount / 100)) // price*((100-50)/100)
    // } else if (price) {
    //     req.body.finalPrice = price - (price * (product.discount / 100)) // price*((100-50)/100)
    // } else if (discount) {
    //     req.body.finalPrice = product.price - (product.price * (discount / 100)) // price*((100-50)/100)
    // }

    //handel images
    if (req.files?.mainImage?.length) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${product.customId}` })
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        req.body.mainImage = { secure_url, public_id }
    }

    if (req.files?.subImages?.length) {
        req.body.subImages = []
        for (const file of req.files.subImages) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path,
                { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_id })
        }
        // if (product.subImages?.length) {
        //     // delete
        // }
    }

    req.body.updatedBy = req.user._id
    await productModel.updateOne({ _id: productId }, req.body)
    return res.status(201).json({ message: "Done", product })
}