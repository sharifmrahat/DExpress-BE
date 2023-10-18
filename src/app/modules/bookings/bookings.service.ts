import {
  Booking,
  BookingStatus,
  Prisma,
  Role,
  LorryStatus,
} from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/api-error";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";
import prismaClient from "../../../shared/prisma-client";
import { IValidateUser } from "../auth/auth.interface";
import { IFilterOption } from "../lorries/lorries.interface";
import { BookingUtils } from "./bookings.utils";

const insertBooking = async (payload: Booking): Promise<Booking> => {
  return await prismaClient.$transaction(async (trxClient) => {
    const existBooking = await trxClient.booking.findMany({
      where: {
        lorryId: payload.lorryId,
        status: {
          in: [BookingStatus.Pending, BookingStatus.Booked],
        },
      },
    });

    if (existBooking.length)
      throw new ApiError(httpStatus.CONFLICT, "This lorry already booked");

    if (!payload.status) payload.status = BookingStatus.Pending;

    const total = await BookingUtils.calculateTotal(
      payload.startTime,
      payload.endTime,
      payload.lorryId
    );

    const createdBooking = await trxClient.booking.create({
      data: { ...payload, total },
    });

    if (!createdBooking)
      throw new ApiError(httpStatus.BAD_REQUEST, "booking has failed!");

    await trxClient.lorry.update({
      where: {
        id: createdBooking.lorryId,
      },
      data: {
        status: LorryStatus.Booked,
      },
    });

    return createdBooking;
  });
};

const updateBooking = async (
  id: string,
  payload: Booking,
  user: IValidateUser
): Promise<Booking> => {
  return await prismaClient.$transaction(async (trxClient) => {
    const exist = await trxClient.booking.findUnique({
      where: {
        id,
      },
    });
    if (user.role === Role.customer && exist?.userId !== user.userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }
    if (!exist) throw new ApiError(httpStatus.NOT_FOUND, "Booking not found!");

    if (payload.status) {
      if (
        (exist.status === BookingStatus.Pending &&
          !(
            BookingStatus.Booked === payload.status ||
            BookingStatus.Rejected === payload.status ||
            BookingStatus.Cancelled === payload.status
          )) ||
        (exist.status === BookingStatus.Booked &&
          !(
            BookingStatus.Cancelled === payload.status ||
            BookingStatus.Completed === payload.status
          )) ||
        exist.status === BookingStatus.Cancelled ||
        exist.status === BookingStatus.Rejected ||
        exist.status === BookingStatus.Completed
      ) {
        throw new ApiError(
          httpStatus.NOT_ACCEPTABLE,
          "Invalid status can not proceed"
        );
      }
      if (payload.status && exist.status !== payload.status) {
        if (
          !(
            payload.status === BookingStatus.Pending ||
            payload.status === BookingStatus.Cancelled
          )
        ) {
          if (user.role === Role.customer)
            throw new ApiError(
              httpStatus.NOT_ACCEPTABLE,
              "Only Admin can update"
            );
        } else {
          if (user.role !== Role.customer)
            throw new ApiError(
              httpStatus.NOT_ACCEPTABLE,
              "Only Customer can update"
            );
        }
      }

      const existBooking = await trxClient.booking.findMany({
        where: {
          lorryId: payload.lorryId ?? exist.lorryId,
          status: {
            in: [BookingStatus.Pending, BookingStatus.Booked],
          },
          id: {
            not: id,
          },
        },
      });

      if (existBooking.length)
        throw new ApiError(httpStatus.CONFLICT, "This lorry is already booked");
    }

    const total = await BookingUtils.calculateTotal(
      payload.startTime ?? exist.startTime,
      payload.endTime ?? exist.endTime,
      payload.lorryId ?? exist.lorryId
    );

    const updatedBooking = await trxClient.booking.update({
      where: {
        id,
      },
      data: { ...payload, total },
    });

    if (
      exist.status !== updatedBooking.status &&
      (updatedBooking.status === BookingStatus.Cancelled ||
        updatedBooking.status === BookingStatus.Completed ||
        updatedBooking.status === BookingStatus.Rejected)
    )
      await trxClient.lorry.update({
        where: {
          id: updatedBooking.lorryId,
        },
        data: {
          status: LorryStatus.Available,
        },
      });

    return updatedBooking;
  });
};

const findOneBooking = async (
  id: string,
  payload: IValidateUser
): Promise<Booking | null> => {
  const bookingExist = await prismaClient.booking.findUnique({
    where: {
      id,
    },
  });
  if (!bookingExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Booking does not exist!");

  if (payload.role === Role.admin) return bookingExist;

  if (
    payload.role === Role.customer &&
    payload.userId !== bookingExist?.userId
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden Access!");
  }

  return bookingExist;
};

const findBookings = async (
  payload: IValidateUser,
  filterOptions: IFilterOption,
  paginationOptions: IPaginationOption
) => {
  const { size, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  const { search, ...options } = filterOptions;
  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        if (field === "minTotal") {
          return {
            total: {
              gte: Number(value),
            },
          };
        }

        if (field === "maxTotal") {
          return {
            total: {
              lte: Number(value),
            },
          };
        }
        if (field === "minRating") {
          return {
            reviewAndRatings: {
              rating: {
                gte: Number(value),
              },
            },
          };
        }
        if (field === "rating") {
          return {
            reviewAndRatings: {
              rating: Number(value),
            },
          };
        }

        if (payload.role === Role.customer) {
          return {
            userId: payload.userId,
          };
        }

        return {
          [field]: value,
        };
      }),
    });
  }

  const whereCondition: Prisma.BookingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const bookings = await prismaClient.booking.findMany({
    where: whereCondition,
    include: {
      lorry: true,
      user: true,
      reviews: true,
    },
    skip,
    take: size,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const count = await prismaClient.booking.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      size,
      total: count,
      totalPage: !isNaN(count / size) ? Math.ceil(count / size) : 0,
    },
    data: bookings,
  };
};

export const BookingService = {
  insertBooking,
  findOneBooking,
  findBookings,
  updateBooking,
};
