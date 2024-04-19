import express from "express";
import { ArticleController } from "./articles.controller";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ArticleValidation } from "./articels.validation";
import validateRequest from "../../middlewares/validate-request";

const router = express.Router();

router
  .route("/")
  .get(auth("public"), ArticleController.findArticles)
  .post(
    auth(Role.admin, Role.super_admin),
    validateRequest(ArticleValidation.createArticleZodSchema),
    ArticleController.insertArticle
  );

router
  .route("/my-articles")
  .get(
    auth(Role.admin, Role.super_admin),
    ArticleController.findArticlesByUserId
  );

router
  .route("/:id")
  .get(ArticleController.findOneArticle)
  .patch(
    validateRequest(ArticleValidation.updateArticleZodSchema),
    auth(Role.admin, Role.super_admin),
    ArticleController.updateArticle
  )
  .delete(auth(Role.admin, Role.super_admin), ArticleController.deleteArticle);

export const ArticleRouter = router;
