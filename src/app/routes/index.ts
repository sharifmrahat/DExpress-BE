import express from "express";
import { AuthRouter } from "../modules/auth/auth.router";
import { UserRouter } from "../modules/users/users.router";
import { ServiceRouter } from "../modules/services/services.router";
import { PackageRouter } from "../modules/packages/packages.router";
import { FeedbackRouter } from "../modules/feedbacks/feedbacks.router";
import { ArticleRouter } from "../modules/articles/articles.router";
const router = express.Router();

const routes = [
  { path: "/auth", module: AuthRouter },
  { path: "/users", module: UserRouter },
  { path: "/services", module: ServiceRouter },
  { path: "/packages", module: PackageRouter },
  { path: "/feedbacks", module: FeedbackRouter },
  { path: "/articles", module: ArticleRouter },
];

routes.forEach((route) => {
  router.use(route.path, route.module);
});

export const AppRouter = router;
