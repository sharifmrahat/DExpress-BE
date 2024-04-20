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
import { IBookingFilterOption } from "./bookings.interface";

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

const findAllBookings = async (
  filterOptions: IBookingFilterOption,
  paginationOptions: IPaginationOption
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  const { search, ...options } = filterOptions;
  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        if (field === "minTotal") {
          return {
            totalCost: {
              gte: Number(value),
            },
          };
        }

        if (field === "maxTotal") {
          return {
            totalCost: {
              lte: Number(value),
            },
          };
        }

        //TODO: implement date related field
        return {
          [field]: value,
        };
      }),
    });
  }

  if (search)
    andCondition.push({
      OR: ["bkId", "bookingType", "remarks", "status"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.BookingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const bookings = await prismaClient.booking.findMany({
    where: whereCondition,
    include: {
      user: true,
      service: true,
      package: true,
      review: true,
      payments: true,
      bookingLogs: true,
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
  const count = await prismaClient.booking.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: bookings,
  };
};

const findOneBooking = async (
  id: string,
  user: IValidateUser
): Promise<Booking | null> => {
  if (user.role === Role.customer && user.userId !== id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden Access!");
  }

  const bookingExist = await prismaClient.booking.findUnique({
    where: {
      id,
      userId: user.userId,
    },
    include: {
      user: true,
      service: true,
      package: true,
      review: true,
      payments: true,
      bookingLogs: true,
    },
  });
  if (!bookingExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Booking does not exist!");

  return bookingExist;
};

const findMyBookings = async (
  filterOptions: IBookingFilterOption,
  paginationOptions: IPaginationOption,
  validateUser: IValidateUser
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];
  andCondition.push({ userId: validateUser.userId });

  const { search, ...options } = filterOptions;
  if (Object.keys(options).length) {
    andCondition.push({
      AND: Object.entries(options).map(([field, value]) => {
        if (field === "minTotal") {
          return {
            totalCost: {
              gte: Number(value),
            },
          };
        }

        if (field === "maxTotal") {
          return {
            totalCost: {
              lte: Number(value),
            },
          };
        }

        //TODO: implement date related field
        return {
          [field]: value,
        };
      }),
    });
  }

  if (search)
    andCondition.push({
      OR: ["bkId", "bookingType", "remarks", "status"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.BookingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const bookings = await prismaClient.booking.findMany({
    where: whereCondition,
    include: {
      user: true,
      service: true,
      package: true,
      review: true,
      payments: true,
      bookingLogs: true,
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

  const count = await prismaClient.booking.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: bookings,
  };
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
        ...(user.role === Role.customer && { userId: user.userId }),
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

//update status
//update payment (from payment module after complete payment)
//delete booking (owner only, soft delete)

export const BookingService = {
  insertBooking,
  findAllBookings,
  findOneBooking,
  updateBooking,
  findMyBookings,
};
