import httpStatus from "http-status";
import prismaClient from "../../../shared/prisma-client";
import { Article, ArticleStatus, Prisma, Role } from "@prisma/client";
import ApiError from "../../../errors/api-error";
import { IValidateUser } from "../auth/auth.interface";
import { IArticleFilterOption } from "./articles.interface";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";
import { makeId } from "../../../utils/makeUid";

const insertArticle = async (payload: Article): Promise<Article> => {
  const articleExist = await prismaClient.article.findFirst({
    where: {
      title: { equals: payload.title },
    },
  });
  if (articleExist)
    throw new ApiError(
      httpStatus.CONFLICT,
      "Article already exist with same title!"
    );
  const createdArticle = await prismaClient.article.create({
    data: payload,
  });

  return createdArticle;
};

const findArticles = async (
  filterOptions: IArticleFilterOption,
  paginationOptions: IPaginationOption,
  validateUser: IValidateUser
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  const { search, status, ...options } = filterOptions;
  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        return {
          [field]: value,
        };
      }),
    });
  }

  if (
    !validateUser ||
    validateUser.role === Role.customer ||
    validateUser.role === Role.admin
  ) {
    andCondition.push({ status: ArticleStatus.Published });
  }

  if (validateUser && validateUser.role === Role.super_admin && status) {
    andCondition.push({ status: status });
  }

  if (search)
    andCondition.push({
      OR: ["title", "description"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.ArticleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const articles = await prismaClient.article.findMany({
    where: whereCondition,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          imageUrl: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prismaClient.article.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: articles,
  };
};

const findOneArticle = async (id: string): Promise<Article | null> => {
  const articleExist = await prismaClient.article.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!articleExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Article not exists");

  await prismaClient.article.update({
    where: {
      id,
    },
    data: { totalReading: articleExist.totalReading + 1 },
  });

  return articleExist;
};

const findArticlesByUserId = async (
  filterOptions: IArticleFilterOption,
  paginationOptions: IPaginationOption,
  validateUser: IValidateUser
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  andCondition.push({ userId: validateUser.userId });

  const { search, ...options } = filterOptions;

  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        return {
          [field]: value,
        };
      }),
    });
  }

  if (search)
    andCondition.push({
      OR: ["title", "description"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.ArticleWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const articles = await prismaClient.article.findMany({
    where: whereCondition,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          imageUrl: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prismaClient.article.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: articles,
  };
};

const updateArticle = async (
  id: string,
  payload: Article,
  validateUser: IValidateUser
): Promise<Article | null> => {
  const articleExist = await prismaClient.article.findUnique({
    where: {
      id,
      ...(validateUser.role !== Role.super_admin && {
        userId: validateUser.userId,
      }),
    },
  });

  if (!articleExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Article not exists");

  const article = await prismaClient.article.update({
    where: {
      id,
      ...(validateUser.role !== Role.super_admin && {
        userId: validateUser.userId,
      }),
    },
    data: payload,
  });

  return article;
};

const deleteArticle = async (
  id: string,
  validateUser: IValidateUser
): Promise<Article | null> => {
  const articleExist = await prismaClient.article.findUnique({
    where: {
      id,
      ...(validateUser.role !== Role.super_admin && {
        userId: validateUser.userId,
      }),
    },
  });

  if (!articleExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Article not exists");

  await prismaClient.article.delete({
    where: {
      id,
    },
  });

  return articleExist;
};

export const ArticleService = {
  insertArticle,
  findOneArticle,
  findArticles,
  findArticlesByUserId,
  updateArticle,
  deleteArticle,
};
