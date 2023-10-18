import httpStatus from "http-status";
import prismaClient from "../../../shared/prisma-client";
import { Feedback } from "@prisma/client";
import ApiError from "../../../errors/api-error";

const insertFeedback = async (payload: Feedback): Promise<Feedback> => {
  const feedbackExist = await prismaClient.feedback.findFirst({
    where: {
      topic: { equals: payload.topic },
    },
  });
  if (feedbackExist)
    throw new ApiError(httpStatus.CONFLICT, "Feedback is already exist!");
  const createdFeedback = await prismaClient.feedback.create({
    data: payload,
  });

  return createdFeedback;
};

const updateFeedback = async (
  id: string,
  payload: Feedback
): Promise<Feedback | null> => {
  const feedbackExist = await prismaClient.feedback.findUnique({
    where: {
      id,
    },
  });

  if (!feedbackExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Feedback does not exists");

  const feedback = await prismaClient.feedback.update({
    where: {
      id,
    },
    data: payload,
  });

  return feedback;
};

const deleteFeedback = async (id: string): Promise<Feedback | null> => {
  const feedbackExist = await prismaClient.feedback.findUnique({
    where: {
      id,
    },
  });

  if (!feedbackExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Feedback does not exists");

  await prismaClient.feedback.delete({
    where: {
      id,
    },
  });

  return feedbackExist;
};

const findOneFeedback = async (id: string): Promise<Feedback | null> => {
  const feedbackExist = await prismaClient.feedback.findUnique({
    where: {
      id,
    },
  });

  if (!feedbackExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Feedback does not exists");

  return feedbackExist;
};

const findFeedbacks = async (): Promise<Feedback[]> => {
  const feedbacks = await prismaClient.feedback.findMany({});

  return feedbacks;
};

export const FeedbackService = {
  insertFeedback,
  updateFeedback,
  deleteFeedback,
  findOneFeedback,
  findFeedbacks,
};
