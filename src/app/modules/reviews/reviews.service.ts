import httpStatus from "http-status";
import prismaClient from "../../../shared/prisma-client";
import { BookingStatus, Review } from "@prisma/client";
import ApiError from "../../../errors/api-error";

const insertReview = async (payload: Review): Promise<Review> => {
  const reviewExist = await prismaClient.review.findFirst({
    where: {
      userId: payload.userId,
      bookingId: payload.userId,
    },
  });
  if (reviewExist)
    throw new ApiError(httpStatus.CONFLICT, "Review and rating already exist!");

  const booking = await prismaClient.booking.findUnique({
    where: {
      id: payload.bookingId,
    },
  });
  if (booking?.status !== BookingStatus.COMPLETED)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Review and rating only for completed booking!"
    );

  const createdReview = await prismaClient.review.create({
    data: payload,
  });

  return createdReview;
};

const updateReview = async (
  id: string,
  payload: Review
): Promise<Review | null> => {
  const reviewExist = await prismaClient.review.findUnique({
    where: {
      id,
    },
  });

  if (!reviewExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Review and rating not exists");

  const review = await prismaClient.review.update({
    where: {
      id,
    },
    data: payload,
  });

  return review;
};

const deleteReview = async (id: string): Promise<Review | null> => {
  const reviewExist = await prismaClient.review.findUnique({
    where: {
      id,
    },
  });

  if (!reviewExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Review and rating not exists");

  await prismaClient.review.delete({
    where: {
      id,
    },
  });

  return reviewExist;
};

const findOneReview = async (id: string): Promise<Review | null> => {
  const reviewExist = await prismaClient.review.findUnique({
    where: {
      id,
    },
  });

  if (!reviewExist)
    throw new ApiError(httpStatus.NOT_FOUND, "review and rating not exists");

  return reviewExist;
};

const findReviews = async (): Promise<Review[]> => {
  const reviews = await prismaClient.review.findMany({
    include: {
      user: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  return reviews;
};

export const ReviewService = {
  insertReview,
  updateReview,
  deleteReview,
  findOneReview,
  findReviews,
};
