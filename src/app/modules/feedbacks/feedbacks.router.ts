import express from "express";
import { FeedbackController } from "./feedbacks.controller";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { FeedbackValidation } from "./feedbacks.validation";
import validateRequest from "../../middlewares/validate-request";

const router = express.Router();

router
  .route("/create-feedback")
  .post(
    validateRequest(FeedbackValidation.createFeedbackZodSchema),
    auth(Role.customer, "public"),
    FeedbackController.insertFeedback
  );

router.route("/").get(FeedbackController.findFeedbacks);

router
  .route("/:id")
  .get(FeedbackController.findOneFeedback)
  .patch(
    validateRequest(FeedbackValidation.updateFeedbackZodSchema),
    auth(Role.customer, Role.admin, Role.super_admin),
    FeedbackController.updateFeedback
  )
  .delete(
    auth(Role.admin, Role.super_admin),
    FeedbackController.deleteFeedback
  );

export const FeedbackRouter = router;
