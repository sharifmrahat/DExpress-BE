import express from "express";
import { FeedbackController } from "./feedbacks.controller";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { FeedbackValidation } from "./feedbacks.validation";
import validateRequest from "../../middlewares/validate-request";

const router = express.Router();

router
  .route("/")
  .get(auth("public"), FeedbackController.findFeedbacks)
  .post(
    auth(Role.customer),
    validateRequest(FeedbackValidation.createFeedbackZodSchema),
    FeedbackController.insertFeedback
  );

router
  .route("/my-feedbacks")
  .get(auth(Role.customer), FeedbackController.findFeedbacksByUserId);

router
  .route("/:id")
  .get(auth("public"), FeedbackController.findOneFeedback)
  .patch(
    auth(Role.customer),
    validateRequest(FeedbackValidation.updateFeedbackZodSchema),
    FeedbackController.updateFeedback
  )
  .delete(auth(Role.customer), FeedbackController.deleteFeedback);

export const FeedbackRouter = router;
