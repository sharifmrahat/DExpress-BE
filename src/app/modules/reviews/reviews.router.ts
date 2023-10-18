import express from "express";
import { ReviewController } from "./reviews.controller";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";
import { ReviewValidation } from "./reviews.validation";
import validateRequest from "../../middlewares/validate-request";

const router = express.Router();

router
  .route("/create-review")
  .post(
    validateRequest(ReviewValidation.createReviewZodSchema),
    auth(Role.customer),
    ReviewController.insertReview
  );

router.route("/").get(ReviewController.findReviews);

router
  .route("/:id")
  .get(ReviewController.findOneReview)
  .patch(
    validateRequest(ReviewValidation.updateReviewZodSchema),
    auth(Role.customer),
    ReviewController.updateReview
  )
  .delete(auth(Role.customer), ReviewController.deleteReview);

export const ReviewRouter = router;
