import httpStatus from "http-status";
import prismaClient from "../../../shared/prisma-client";
import { BookingStatus, Prisma, Review } from "@prisma/client";
import ApiError from "../../../errors/api-error";
import { IReviewFilterOption } from "./reviews.interface";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";
import { IValidateUser } from "../auth/auth.interface";

const insertReview = async (payload: Review): Promise<Review> => {
  const bookingExist = await prismaClient.booking.findUnique({
    where: {
      id: payload.bookingId,
      userId: payload.userId,
      status: BookingStatus.Delivered,
    },
  });
  if (!bookingExist)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No delivered booking is found to review"
    );

  const reviewExist = await prismaClient.review.findFirst({
    where: {
      userId: bookingExist.userId,
      bookingId: bookingExist.id,
    },
  });
  if (reviewExist)
    throw new ApiError(
      httpStatus.CONFLICT,
      "Review already exist for this booking!"
    );

  if (payload.rating < 1 || payload.rating > 5) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Rating must be greater than 1 and less than 5"
    );
  }

  const createdReview = await prismaClient.review.create({
    data: {
      ...payload,
      serviceId: bookingExist.serviceId,
      packageId: bookingExist.packageId,
    },
  });

  return createdReview;
};

const findAllReviews = async (
  filterOptions: IReviewFilterOption,
  paginationOptions: IPaginationOption
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  const { search, ...options } = filterOptions;

  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        if (field === "minRating") {
          return {
            rating: {
              gte: Number(value),
            },
          };
        }

        if (field === "maxRating") {
          return {
            rating: {
              lte: Number(value),
            },
          };
        }

        return {
          [field]: value,
        };
      }),
    });
  }

  if (search)
    andCondition.push({
      OR: ["description"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.ReviewWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const reviews = await prismaClient.review.findMany({
    where: whereCondition,
    include: {
      booking: true,
      service: true,
      package: true,
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

  const count = await prismaClient.review.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: reviews,
  };
};

const findMyReviews = async (
  filterOptions: IReviewFilterOption,
  paginationOptions: IPaginationOption,
  validateUser: IValidateUser
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  const { search, ...options } = filterOptions;

  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        if (field === "minRating") {
          return {
            rating: {
              gte: Number(value),
            },
          };
        }

        if (field === "maxRating") {
          return {
            rating: {
              lte: Number(value),
            },
          };
        }

        return {
          [field]: value,
        };
      }),
    });
  }

  if (search)
    andCondition.push({
      OR: ["description"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.ReviewWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const reviews = await prismaClient.review.findMany({
    where: whereCondition,
    include: {
      booking: true,
      service: true,
      package: true,
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

  const count = await prismaClient.review.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: reviews,
  };
};

const findOneReview = async (id: string): Promise<Review | null> => {
  const reviewExist = await prismaClient.review.findUnique({
    where: {
      id,
    },
    include: {
      booking: true,
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

  if (!reviewExist)
    throw new ApiError(httpStatus.NOT_FOUND, "review and rating not exists");

  return reviewExist;
};

const updateReview = async (
  id: string,
  payload: Review,
  validateUser: IValidateUser
): Promise<Review | null> => {
  const reviewExist = await prismaClient.review.findUnique({
    where: {
      id,
      userId: validateUser.userId,
    },
  });

  if (!reviewExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Review does not exists");

  if (payload.rating && (payload.rating < 1 || payload.rating > 5)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Rating must be greater than 1 and less than 5"
    );
  }

  const review = await prismaClient.review.update({
    where: {
      id,
      userId: validateUser.userId,
    },
    data: payload,
  });

  return review;
};

const deleteReview = async (
  id: string,
  validateUser: IValidateUser
): Promise<Review | null> => {
  const reviewExist = await prismaClient.review.findUnique({
    where: {
      id,
      userId: validateUser.userId,
    },
  });

  if (!reviewExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Review does not exists");

  await prismaClient.feedback.delete({
    where: {
      id,
      userId: validateUser.userId,
    },
  });

  return reviewExist;
};

export const ReviewService = {
  insertReview,
  findAllReviews,
  findMyReviews,
  findOneReview,
  updateReview,
  deleteReview,
};
