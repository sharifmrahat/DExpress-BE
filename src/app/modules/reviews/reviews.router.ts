import express from "express";
import { ReviewController } from "./reviews.controller";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ReviewValidation } from "./reviews.validation";
import validateRequest from "../../middlewares/validate-request";

const router = express.Router();

router
  .route("/")
  .get(ReviewController.findAllReviews)
  .post(
    auth(Role.customer),
    validateRequest(ReviewValidation.createReviewZodSchema),
    ReviewController.insertReview
  );

router
  .route("/my-reviews")
  .get(auth(Role.customer), ReviewController.findMyReviews);

router
  .route("/:id")
  .get(ReviewController.findOneReview)
  .patch(
    auth(Role.customer),
    validateRequest(ReviewValidation.updateReviewZodSchema),
    ReviewController.updateReview
  )
  .delete(auth(Role.customer), ReviewController.deleteReview);

export const ReviewRouter = router;
