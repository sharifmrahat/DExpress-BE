import {
  Booking,
  BookingStatus,
  Prisma,
  Role,
  BookingType,
  PaymentMethod,
} from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/api-error";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";
import prismaClient from "../../../shared/prisma-client";
import { IValidateUser } from "../auth/auth.interface";
import { IFilterOption } from "../lorries/lorries.interface";
import { makeId } from "../../../utils/makeUid";

const insertBooking = async (payload: Booking): Promise<Booking> => {
  return await prismaClient.$transaction(async (trxClient) => {
    const selectedService = await trxClient.service.findUnique({
      where: { id: payload.serviceId },
    });
    if (!selectedService) {
      throw new ApiError(httpStatus.NOT_FOUND, "Service not exist");
    }

    const existBooking = await trxClient.booking.findFirst({
      where: {
        userId: payload.userId,
        serviceId: selectedService.id,
        status: BookingStatus.Created,
      },
    });

    if (existBooking)
      throw new ApiError(
        httpStatus.CONFLICT,
        `This Service already booked by you, BookingId: ${existBooking.bkId}, status: ${existBooking.status}`
      );

    if (payload.packageId) {
      const selectedPackage = await trxClient.package.findUnique({
        where: { id: payload.packageId },
      });
      if (!selectedPackage) {
        throw new ApiError(httpStatus.NOT_FOUND, "Package not exist");
      }
      payload.packageId = selectedPackage.id;
      payload.totalCost = selectedPackage.price;
    }

    if (
      payload.bookingType === BookingType.Custom ||
      payload.paymentMethod !== PaymentMethod.COD
    ) {
      payload.status = BookingStatus.Drafted;
    }

    const bkId = makeId("DXBK");
    payload.bkId = bkId;

    const createdBooking = await trxClient.booking.create({
      data: payload,
    });

    if (!createdBooking)
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to book the service");

    await trxClient.bookingLog.create({
      data: {
        userId: createdBooking.userId,
        bookingId: createdBooking.id,
        currentStatus: createdBooking.status,
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
    if (user.role === Role.customer && id !== user.userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    const exist = await trxClient.booking.findUnique({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!exist) throw new ApiError(httpStatus.NOT_FOUND, "Booking not found!");

    if (payload.packageId) {
      const selectedPackage = await trxClient.package.findUnique({
        where: { id: payload.packageId },
      });
      if (!selectedPackage) {
        throw new ApiError(httpStatus.NOT_FOUND, "Package not exist");
      }
      payload.totalCost = selectedPackage.price;
    }

    if (
      (payload.bookingType && payload.bookingType === BookingType.Custom) ||
      (payload.paymentMethod && payload.paymentMethod !== PaymentMethod.COD)
    ) {
      payload.status = BookingStatus.Drafted;
    }

    const updatedBooking = await trxClient.booking.update({
      where: {
        id,
        userId: user.userId,
      },
      data: payload,
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

const findMyBookings = async (
  payload: IValidateUser
): Promise<Booking[] | null> => {
  const bookingExist = await prismaClient.booking.findMany({
    where: {
      userId: payload.userId,
    },
    include: {
      lorry: true,
      user: true,
      reviews: true,
    },
  });
  if (!bookingExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Booking does not exist!");

  return bookingExist;
};

export const BookingService = {
  insertBooking,
  findOneBooking,
  findBookings,
  updateBooking,
  findMyBookings,
};
