import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { IValidateUser } from "../auth/auth.interface";
import { ReviewService } from "./reviews.service";

const insertReview = catchAsync(async (req, res) => {
  const review = req.body;

  const user = (req as any).user as IValidateUser;
  if (user) review.userId = user.userId;

  const result = await ReviewService.insertReview(review);

  return responseData({ message: "Review is added successfully", result }, res);
});

const findAllReviews = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "userId",
    "bookingId",
    "minRating",
    "maxRating",
  ]);
  const result = await ReviewService.findAllReviews(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Reviews retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findMyReviews = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "userId",
    "bookingId",
    "minRating",
    "maxRating",
  ]);
  const user = (req as any).user as IValidateUser;
  const result = await ReviewService.findMyReviews(
    filterOptions,
    paginationOptions,
    user
  );
  return responseData(
    {
      message: "Reviews retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findOneReview = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ReviewService.findOneReview(id);
  return responseData({ message: "Review fetched successfully", result }, res);
});

const updateReview = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const data = req.body;
  const user = (req as any).user as IValidateUser;

  const result = await ReviewService.updateReview(id, data, user);

  return responseData({ message: "Review updated successfully", result }, res);
});

const deleteReview = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const user = (req as any).user as IValidateUser;

  const result = await ReviewService.deleteReview(id, user);

  return responseData(
    { message: "Feedback deleted successfully", result },
    res
  );
});

export const ReviewController = {
  insertReview,
  findAllReviews,
  findMyReviews,
  findOneReview,
  updateReview,
  deleteReview,
};
