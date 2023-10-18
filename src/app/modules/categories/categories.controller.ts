import catchAsync from "../../../shared/catch-async"
import responseData from "../../../shared/response";
import { CategoryService } from "./categories.service";

const insertCategory = catchAsync(async (req, res) => {
  const category = req.body;

  const result = await CategoryService.insertCategory(category);
  
  return responseData({ message: "Category inserted  successfully", result }, res);
});

const updateCategory = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await CategoryService.updateCategory(id, data);

  return responseData({ message: "Category updated  successfully", result }, res);
});

const deleteCategory = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await CategoryService.deleteCategory(id);

  return responseData({ message: "Category deleted  successfully", result }, res);
});

const findOneCategory = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await CategoryService.findOneCategory(id);
  return responseData({ message: "Category fetched successfully", result }, res);
});

const findCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.findCategories();
  return responseData({ message: "Categories retrieved successfully", result }, res);
});

export const CategoryController = {
  insertCategory,
  updateCategory,
  deleteCategory,
  findOneCategory,
  findCategories,
};
