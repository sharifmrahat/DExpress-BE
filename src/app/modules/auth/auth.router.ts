import express from "express";
import validateRequest from "../../middlewares/validate-request";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";

const router = express.Router();

router
  .route("/signup")
  .post(
    validateRequest(AuthValidation.signupAuthZodSchema),
    AuthController.signup
  );
router
  .route("/login")
  .post(
    validateRequest(AuthValidation.loginAuthZodSchema),
    AuthController.login
  );

router
  .route("/social")
  .post(
    validateRequest(AuthValidation.socialAuthZodSchema),
    AuthController.socialAuth
  );

export const AuthRouter = router;
