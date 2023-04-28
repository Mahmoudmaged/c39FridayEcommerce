import { asyncHandler } from "../../../utils/errorHandling.js";
import subcategoryModel from "../../../../DB/model/Subcategory.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from 'slugify'
import categoryModel from "../../../../DB/model/Category.model.js";


export const getSubcategory = asyncHandler(async (req, res, next) => {
    const subcategory = await subcategoryModel.find({
        isDeleted: false
    }).populate([
        {
            path: 'categoryId'
        }
    ])
    return res.status(200).json({ message: "Done", subcategoryList: subcategory })
})


export const createSubcategory = asyncHandler(async (req, res, next) => {


    if (!await categoryModel.findById(req.params.categoryId)) {
        return res.status(409).json({ message: `In-valid category ID` })
    }

    const { name } = req.body;
    if (await subcategoryModel.findOne({ name: name.toLowerCase() })) {
        return res.status(409).json({ message: `Duplicated subcategory name ${name}` })
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${req.params.categoryId}` })
    const subcategory = await subcategoryModel.create({
        name: name.toLowerCase(),
        slug: slugify(name.toLowerCase()),
        image: { secure_url, public_id },
        categoryId: req.params.categoryId,
        createdBy: req.user._id
    })
    return res.status(201).json({ message: "Done", subcategory })
})


export const updateSubcategory = asyncHandler(async (req, res, next) => {


    const { categoryId, subcategoryId } = req.params;
    // subcategoryId = 5;
    const subcategory = await subcategoryModel.findOne({ _id: subcategoryId, categoryId })
    if (!subcategory) {
        // return res.status(400).json({ message: `In-valid subcategory Id` })
        return next(new Error('In-valid subcategory Id', { cause: 400 }))
    }

    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == subcategory.name) {
            return next(new Error(`Can not updated subcategory with the same old name`, { cause: 400 }))

        }
        if (await subcategoryModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated subcategory name ${req.body.name}`, { cause: 409 }))

        }
        subcategory.name = req.body.name
        subcategory.slug = slugify(req.body.name)

    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category/${categoryId}` })
        await cloudinary.uploader.destroy(subcategory.image.public_id) // delete old pic
        subcategory.image = { secure_url, public_id }

    }

    subcategory.updatedBy = req.user._id
    await subcategory.save()
    return res.status(200).json({ message: "Done", subcategory })
})