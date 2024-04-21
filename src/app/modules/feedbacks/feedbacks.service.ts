import httpStatus from "http-status";
import prismaClient from "../../../shared/prisma-client";
import { BookingStatus, Feedback, Prisma } from "@prisma/client";
import ApiError from "../../../errors/api-error";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";
import { IFeedbackFilterOption } from "./feedbacks.interface";
import { IValidateUser } from "../auth/auth.interface";

const insertFeedback = async (payload: Feedback): Promise<Feedback> => {
  const bookingExist = await prismaClient.booking.findMany({
    where: {
      userId: payload.userId,
      NOT: {
        status: {
          in: [
            BookingStatus.Drafted,
            BookingStatus.Created,
            BookingStatus.Cancelled,
            BookingStatus.Reverted,
          ],
        },
      },
    },
  });

  if (!bookingExist.length) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Not eligible to post feedback!"
    );
  }
  const feedbackExist = await prismaClient.feedback.findFirst({
    where: {
      userId: payload.userId,
    },
  });

  if (feedbackExist)
    throw new ApiError(httpStatus.CONFLICT, "You've already posted a feedback");

  const createdFeedback = await prismaClient.feedback.create({
    data: payload,
  });

  return createdFeedback;
};

const findFeedbacks = async (
  filterOptions: IFeedbackFilterOption,
  paginationOptions: IPaginationOption
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  const { search, ...options } = filterOptions;
  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        return {
          [field]: value,
        };
      }),
    });
  }

  if (search)
    andCondition.push({
      OR: ["subject", "message"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.FeedbackWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const feedbacks = await prismaClient.feedback.findMany({
    where: whereCondition,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          imageUrl: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prismaClient.feedback.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: feedbacks,
  };
};

const findOneFeedback = async (id: string): Promise<Feedback | null> => {
  const feedbackExist = await prismaClient.feedback.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!feedbackExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Feedback does not exists");

  return feedbackExist;
};

const findFeedbacksByUserId = async (
  filterOptions: IFeedbackFilterOption,
  paginationOptions: IPaginationOption,
  validateUser: IValidateUser
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  andCondition.push({ userId: validateUser.userId });

  const { search } = filterOptions;

  if (search)
    andCondition.push({
      OR: ["subject", "message"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.FeedbackWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const feedbacks = await prismaClient.feedback.findMany({
    where: whereCondition,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          imageUrl: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prismaClient.feedback.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: feedbacks,
  };
};

const updateFeedback = async (
  id: string,
  payload: Feedback,
  validateUser: IValidateUser
): Promise<Feedback | null> => {
  const feedbackExist = await prismaClient.feedback.findUnique({
    where: {
      id,
      userId: validateUser.userId,
    },
  });

  if (!feedbackExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Feedback does not exists");

  if (payload.subject) {
    const feedbackExist = await prismaClient.feedback.findFirst({
      where: {
        subject: { equals: payload.subject },
        userId: payload.userId,
        NOT: {
          id,
        },
      },
    });
    if (feedbackExist)
      throw new ApiError(
        httpStatus.CONFLICT,
        "Feedback is already exist with same subject!"
      );
  }

  const feedback = await prismaClient.feedback.update({
    where: {
      id,
      userId: validateUser.userId,
    },
    data: payload,
  });

  return feedback;
};

const deleteFeedback = async (
  id: string,
  validateUser: IValidateUser
): Promise<Feedback | null> => {
  const feedbackExist = await prismaClient.feedback.findUnique({
    where: {
      id,
      userId: validateUser.userId,
    },
  });

  if (!feedbackExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Feedback does not exists");

  await prismaClient.feedback.delete({
    where: {
      id,
      userId: validateUser.userId,
    },
  });

  return feedbackExist;
};

export const FeedbackService = {
  insertFeedback,
  findOneFeedback,
  findFeedbacks,
  findFeedbacksByUserId,
  updateFeedback,
  deleteFeedback,
};
