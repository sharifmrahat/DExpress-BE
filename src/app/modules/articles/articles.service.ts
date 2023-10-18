import httpStatus from "http-status";
import prismaClient from "../../../shared/prisma-client";
import { Article } from "@prisma/client";
import ApiError from "../../../errors/api-error";

const insertArticle = async (payload: Article): Promise<Article> => {
  const articleExist = await prismaClient.article.findFirst({
    where: {
      title: { equals: payload.title },
    },
  });
  if (articleExist)
    throw new ApiError(httpStatus.CONFLICT, "Article already exist!");
  const createdArticle = await prismaClient.article.create({
    data: payload,
  });

  return createdArticle;
};

const updateArticle = async (
  id: string,
  payload: Article
): Promise<Article | null> => {
  const articleExist = await prismaClient.article.findUnique({
    where: {
      id,
    },
  });

  if (!articleExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Article not exists");

  const article = await prismaClient.article.update({
    where: {
      id,
    },
    data: payload,
  });

  return article;
};

const deleteArticle = async (id: string): Promise<Article | null> => {
  const articleExist = await prismaClient.article.findUnique({
    where: {
      id,
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

const findOneArticle = async (id: string): Promise<Article | null> => {
  const articleExist = await prismaClient.article.findUnique({
    where: {
      id,
    },
  });

  if (!articleExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Article not exists");

  return articleExist;
};

const findArticles = async (): Promise<Article[]> => {
  const articles = await prismaClient.article.findMany({});

  return articles;
};

export const ArticleService = {
  insertArticle,
  updateArticle,
  deleteArticle,
  findOneArticle,
  findArticles,
};
