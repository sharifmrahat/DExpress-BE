import express from "express";
import { AuthRouter } from "../modules/auth/auth.router";
import { UserRouter } from "../modules/users/users.router";
import { ServiceRouter } from "../modules/services/services.router";
const router = express.Router();

const routes = [
  { path: "/auth", module: AuthRouter },
  { path: "/users", module: UserRouter },
  { path: "/services", module: ServiceRouter },
];

routes.forEach((route) => {
  router.use(route.path, route.module);
});

export const AppRouter = router;
