import catchAsync from "../../../shared/catch-async";
import responseData from "../../../shared/response";
import { IValidateUser } from "../auth/auth.interface";
import { ReviewService } from "./reviews.service";

const insertReview = catchAsync(async (req, res) => {
  const review = req.body;

  const user = (req as any).user as IValidateUser;
  if (user) review.userId = user.userId;

  const result = await ReviewService.insertReview(review);

  return responseData(
    { message: "Review And Rating inserted  successfully", result },
    res
  );
});

const updateReview = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const user = (req as any).user as IValidateUser;
  if (user) data.userId = user.userId;
  const result = await ReviewService.updateReview(id, data);

  return responseData(
    { message: "Review And Rating updated  successfully", result },
    res
  );
});

const deleteReview = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ReviewService.deleteReview(id);

  return responseData({ message: "Review deleted  successfully", result }, res);
});

const findOneReview = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ReviewService.findOneReview(id);
  return responseData({ message: "Review fetched successfully", result }, res);
});

const findReviews = catchAsync(async (req, res) => {
  const result = await ReviewService.findReviews();
  return responseData(
    { message: "Reviews retrieved successfully", result },
    res
  );
});

export const ReviewController = {
  insertReview,
  updateReview,
  deleteReview,
  findOneReview,
  findReviews,
};
