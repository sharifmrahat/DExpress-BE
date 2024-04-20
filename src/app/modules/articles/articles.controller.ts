import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { IValidateUser } from "../auth/auth.interface";
import { ArticleService } from "./articles.service";

const insertArticle = catchAsync(async (req, res) => {
  const article = req.body;
  const user = (req as any).user as IValidateUser;
  if (user) article.userId = user.userId;

  const result = await ArticleService.insertArticle(article);
  return responseData({ message: "Article created successfully", result }, res);
});

const findArticles = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, ["search", "status", "userId"]);
  const user = (req as any).user as IValidateUser;
  const result = await ArticleService.findArticles(
    filterOptions,
    paginationOptions,
    user
  );
  return responseData(
    {
      message: "Articles retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findOneArticle = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ArticleService.findOneArticle(id);
  return responseData({ message: "Article fetched successfully", result }, res);
});

const findArticlesByUserId = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, ["search", "status"]);
  const user = (req as any).user as IValidateUser;
  const result = await ArticleService.findArticlesByUserId(
    filterOptions,
    paginationOptions,
    user
  );
  return responseData(
    {
      message: "Articles retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const updateArticle = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const data = req.body;
  const user = (req as any).user as IValidateUser;
  const result = await ArticleService.updateArticle(id, data, user);

  return responseData({ message: "Article updated successfully", result }, res);
});

const deleteArticle = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = (req as any).user as IValidateUser;
  const result = await ArticleService.deleteArticle(id, user);

  return responseData({ message: "Article deleted successfully", result }, res);
});

export const ArticleController = {
  insertArticle,
  findOneArticle,
  findArticles,
  findArticlesByUserId,
  updateArticle,
  deleteArticle,
};
