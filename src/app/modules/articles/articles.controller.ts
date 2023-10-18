import catchAsync from "../../../shared/catch-async";
import responseData from "../../../shared/response";
import { ArticleService } from "./articles.service";

const insertArticle = catchAsync(async (req, res) => {
  const article = req.body;

  const result = await ArticleService.insertArticle(article);

  return responseData(
    { message: "Article inserted  successfully", result },
    res
  );
});

const updateArticle = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ArticleService.updateArticle(id, data);

  return responseData(
    { message: "Article updated  successfully", result },
    res
  );
});

const deleteArticle = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ArticleService.deleteArticle(id);

  return responseData(
    { message: "Article deleted  successfully", result },
    res
  );
});

const findOneArticle = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ArticleService.findOneArticle(id);
  return responseData({ message: "Article fetched successfully", result }, res);
});

const findArticles = catchAsync(async (req, res) => {
  const result = await ArticleService.findArticles();
  return responseData(
    { message: "Articles retrieved successfully", result },
    res
  );
});

export const ArticleController = {
  insertArticle,
  updateArticle,
  deleteArticle,
  findOneArticle,
  findArticles,
};
