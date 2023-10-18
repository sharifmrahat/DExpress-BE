import httpStatus from "http-status";
import prismaClient from "../../../shared/prisma-client";
import { Category } from "@prisma/client";
import ApiError from "../../../errors/api-error";

const insertCategory = async (payload: Category): Promise<Category> => {
  const categoryExist = await prismaClient.category.findFirst({
    where: {
      title: { equals: payload.title },
    },
  });
  if (categoryExist)
    throw new ApiError(httpStatus.CONFLICT, "Category already exist!");
  const createdCategory = await prismaClient.category.create({
    data: payload,
  });

  return createdCategory;
};

const updateCategory = async (
  id: string,
  payload: Category
): Promise<Category | null> => {
  const categoryExist = await prismaClient.category.findUnique({
    where: {
      id,
    },
  });

  if (!categoryExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not exists");

  const category = await prismaClient.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return category;
};

const deleteCategory = async (id: string): Promise<Category | null> => {
  const categoryExist = await prismaClient.category.findUnique({
    where: {
      id,
    },
    include: {
      lorries: true,
    },
  });

  if (!categoryExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not exists");

  await prismaClient.category.delete({
    where: {
      id,
    },
  });

  return categoryExist;
};

const findOneCategory = async (id: string): Promise<Category | null> => {
  const categoryExist = await prismaClient.category.findUnique({
    where: {
      id,
    },
    include: {
      lorries: {
        include: {
          bookings: {
            include: {
              reviews: true,
            },
          },
        },
      },
    },
  });

  if (!categoryExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Category not exists");

  return categoryExist;
};

const findCategories = async (): Promise<Category[]> => {
  const categories = await prismaClient.category.findMany({
    include: {
      lorries: {
        include: {
          bookings: {
            include: {
              reviews: true,
            },
          },
        },
      },
    },
  });

  return categories;
};

export const CategoryService = {
  insertCategory,
  updateCategory,
  deleteCategory,
  findOneCategory,
  findCategories,
};
