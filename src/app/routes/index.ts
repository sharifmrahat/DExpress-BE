import express from "express";
import { AuthRouter } from "../modules/auth/auth.router";
import { UserRouter } from "../modules/users/users.router";
import { CategoryRouter } from "../modules/categories/categories.router";
import { LorryRouter } from "../modules/lorries/lorries.router";
import { FeedbackRouter } from "../modules/feedbacks/feedbacks.router";
import { ReviewRouter } from "../modules/reviews/reviews.router";
const router = express.Router();

const routes = [
  { path: "/auth", module: AuthRouter },
  { path: "/users", module: UserRouter },
  { path: "/categories", module: CategoryRouter },
  { path: "/lorries", module: LorryRouter },
  { path: "/reviews", module: ReviewRouter },
  { path: "/feedbacks", module: FeedbackRouter },
];

routes.forEach((route) => {
  router.use(route.path, route.module);
});

export const AppRouter = router;
