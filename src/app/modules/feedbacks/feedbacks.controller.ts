import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { IValidateUser } from "../auth/auth.interface";
import { FeedbackService } from "./feedbacks.service";

const insertFeedback = catchAsync(async (req, res) => {
  const feedback = req.body;

  const user = (req as any).user as IValidateUser;
  if (user) feedback.userId = user.userId;

  const result = await FeedbackService.insertFeedback(feedback);

  return responseData(
    { message: "Feedback created successfully", result },
    res
  );
});

const findFeedbacks = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "serviceId",
    "minPrice",
    "maxPrice",
  ]);
  const result = await FeedbackService.findFeedbacks(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Feedbacks retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findOneFeedback = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await FeedbackService.findOneFeedback(id);
  return responseData(
    { message: "Feedback fetched successfully", result },
    res
  );
});

const updateFeedback = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const data = req.body;
  const user = (req as any).user as IValidateUser;

  const result = await FeedbackService.updateFeedback(id, data, user);

  return responseData(
    { message: "Feedback updated successfully", result },
    res
  );
});

const deleteFeedback = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const user = (req as any).user as IValidateUser;

  const result = await FeedbackService.deleteFeedback(id, user);

  return responseData(
    { message: "Feedback deleted successfully", result },
    res
  );
});

export const FeedbackController = {
  insertFeedback,
  updateFeedback,
  deleteFeedback,
  findOneFeedback,
  findFeedbacks,
};
