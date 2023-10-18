import express from 'express'
import { CategoryController } from './categories.controller'
import { Role } from '@prisma/client'
import auth from '../../middlewares/auth'
import { CategoryValidation } from './categories.validation'
import validateRequest from '../../middlewares/validate-request'

const router = express.Router()

router.route('/create-category').post(validateRequest(CategoryValidation.createCategoryZodSchema), auth(Role.admin, Role.super_admin), CategoryController.insertCategory)

router.route('/')
.get(CategoryController.findCategories)

router.route('/:id')
.get(CategoryController.findOneCategory)
.patch(validateRequest(CategoryValidation.updateCategoryZodSchema), auth(Role.admin, Role.super_admin), CategoryController.updateCategory)
.delete(auth(Role.admin, Role.super_admin), CategoryController.deleteCategory)

export const CategoryRouter = router