import { asyncHandler } from "../../../utils/errorHandling.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import slugify from 'slugify'


export const getCategory = asyncHandler(async (req, res, next) => {
    const category = await categoryModel.find({
        isDeleted: false
    }).populate([
        {
            path: 'subcategory',
        }
    ])

    return res.status(200).json({ message: "Done", categoryList: category })
})


export const createCategory = asyncHandler(async (req, res, next) => {
    const { name } = req.body;

    if (await categoryModel.findOne({ name: name.toLowerCase() })) {
        return next(new Error(`Duplicated category name ${name}`, { cause: 409 }))

    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })
    const category = await categoryModel.create({
        name: name.toLowerCase(),
        slug: slugify(name.toLowerCase()),
        image: { secure_url, public_id },
        createdBy: req.user._id
    })
    return res.status(201).json({ message: "Done", category })
})


export const updateCategory = asyncHandler(async (req, res, next) => {


    const { categoryId } = req.params;
    // categoryId = 5;
    const category = await categoryModel.findById(categoryId)
    if (!category) {
        return next(new Error('In-valid category Id', { cause: 400 }))
    }

    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
        if (req.body.name == category.name) {
            return next(new Error(`Can not updated category with the same old name`, { cause: 400 }))

        }
        if (await categoryModel.findOne({ name: req.body.name })) {
            return next(new Error(`Duplicated category name ${req.body.name}`, { cause: 409 }))
        }
        category.name = req.body.name
        category.slug = slugify(req.body.name)

    }

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `${process.env.APP_NAME}/category` })
        await cloudinary.uploader.destroy(category.image.public_id) // delete old pic
        category.image = { secure_url, public_id }

    }
    category.updatedBy = req.user._id

    await category.save()
    return res.status(200).json({ message: "Done", category })
})