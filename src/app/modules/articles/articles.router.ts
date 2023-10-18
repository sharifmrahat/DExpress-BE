import express from "express";
import { ArticleController } from "./articles.controller";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ArticleValidation } from "./articels.validation";
import validateRequest from "../../middlewares/validate-request";

const router = express.Router();

router
  .route("/create-article")
  .post(
    validateRequest(ArticleValidation.createArticleZodSchema),
    auth(Role.admin, Role.super_admin),
    ArticleController.insertArticle
  );

router.route("/").get(ArticleController.findArticles);

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
