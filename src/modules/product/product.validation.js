

import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const headers = joi.object({
    authorization: joi.string().required()

}).required()
export const create = joi.object({
    name: joi.string().min(2).max(25).required(),
    description: joi.string().min(2).max(150000),
    stock: joi.number().integer().positive().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().positive().min(1).max(100),
    colors: joi.array(),
    size: joi.array(),

    categoryId: generalFields.id,
    subcategoryId: generalFields.id,
    brandId: generalFields.id,

    file: joi.object({
        mainImage: joi.array().items(generalFields.file.required()).length(1).required(),
        subImages: joi.array().items(generalFields.file).min(1).max(5),

    }).required(),

}).required()


export const update = joi.object({
    name: joi.string().min(2).max(25),
    description: joi.string().min(2).max(150000),
    stock: joi.number().integer().positive().min(1),
    price: joi.number().positive().min(1),
    discount: joi.number().positive().min(1).max(100),
    colors: joi.array(),
    size: joi.array(),

    productId: generalFields.id,
    categoryId: generalFields.optionalId,
    subcategoryId: generalFields.optionalId,
    brandId: generalFields.optionalId,

    file: joi.object({
        mainImage: joi.array().items(generalFields.file).max(1),
        subImages: joi.array().items(generalFields.file).min(1).max(5),

    }).required()

}).required()