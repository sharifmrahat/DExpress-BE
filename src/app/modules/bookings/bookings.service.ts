import {
  Booking,
  BookingStatus,
  Prisma,
  Role,
  BookingType,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/api-error";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";
import prismaClient from "../../../shared/prisma-client";
import { IValidateUser } from "../auth/auth.interface";
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

    const selectedCustomer = await trxClient.user.findUnique({
      where: { id: payload.userId },
    });
    if (!selectedCustomer) {
      throw new ApiError(httpStatus.NOT_FOUND, "Customer not exist");
    }

    const existBooking = await trxClient.booking.findFirst({
      where: {
        userId: payload.userId,
        bookingType: payload.bookingType,
        serviceId: selectedService.id,
        status: { in: [BookingStatus.Drafted, BookingStatus.Created] },
        isDeleted: false,
      },
    });

    if (existBooking)
      throw new ApiError(
        httpStatus.CONFLICT,
        `This Service already ${existBooking.status}, Booking ID: ${existBooking.bkId}`
      );

    if (payload.packageId) {
      const selectedPackage = await trxClient.package.findUnique({
        where: { id: payload.packageId, serviceId: selectedService.id },
      });
      if (!selectedPackage) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Package not exist for this service"
        );
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
        bookingId: createdBooking.id,
        currentStatus: createdBooking.status,
        updatedById: createdBooking.userId,
      },
    });

    const bookedService = await trxClient.service.findFirst({
      where: { id: createdBooking.serviceId },
    });
    await trxClient.service.update({
      where: { id: bookedService?.id },
      data: {
        totalBooking: bookedService?.totalBooking
          ? bookedService?.totalBooking + 1
          : 1,
      },
    });
    if (createdBooking?.packageId) {
      const bookedPackage = await trxClient.package.findFirst({
        where: { id: createdBooking.packageId },
      });
      await trxClient.package.update({
        where: { id: bookedPackage?.id },
        data: {
          totalBooking: bookedPackage?.totalBooking
            ? bookedPackage?.totalBooking + 1
            : 1,
        },
      });
    }
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
      OR: ["bkId", "remarks"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.BookingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const bookings = await prismaClient.booking.findMany({
    where: { ...whereCondition, isDeleted: false },
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
      service: true,
      package: true,
      review: true,
      payments: true,
      bookingLogs: {
        include: {
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              imageUrl: true,
            },
          },
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
  const count = await prismaClient.booking.count({
    where: { ...whereCondition, isDeleted: false },
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
  const bookingExist = await prismaClient.booking.findUnique({
    where: {
      id,
      isDeleted: false,
      userId: user.userId,
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
      service: true,
      package: true,
      review: true,
      payments: true,
      bookingLogs: {
        include: {
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (user.role === Role.customer && user.userId !== bookingExist?.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden Access!");
  }

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
      OR: ["bkId", "remarks"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.BookingWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const bookings = await prismaClient.booking.findMany({
    where: { ...whereCondition, isDeleted: false },
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
      service: true,
      package: true,
      review: true,
      payments: true,
      bookingLogs: {
        include: {
          updatedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              imageUrl: true,
            },
          },
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

  const count = await prismaClient.booking.count({
    where: { ...whereCondition, isDeleted: false },
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
    const exist = await trxClient.booking.findUnique({
      where: {
        id,
        isDeleted: false,
        NOT: {
          status: BookingStatus.Delivered,
        },
        ...(user.role === Role.customer && { userId: user.userId }),
      },
    });

    if (!exist) throw new ApiError(httpStatus.NOT_FOUND, "Booking not found!");

    if (exist.status === BookingStatus.Shipped) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Can not update ${exist.status} booking`
      );
    }

    if (user.role === Role.customer && user.userId !== exist.userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }

    if (payload.packageId) {
      const selectedPackage = await trxClient.package.findUnique({
        where: { id: payload.packageId, serviceId: exist.serviceId },
      });
      if (!selectedPackage) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Package not exist this service"
        );
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
        isDeleted: false,
        ...(user.role === Role.customer && { userId: user.userId }),
      },
      data: payload,
    });

    return updatedBooking;
  });
};

const updateBookingStatus = async (
  id: string,
  status: BookingStatus,
  user: IValidateUser
): Promise<Booking> => {
  return await prismaClient.$transaction(async (trxClient) => {
    const existingBooking = await trxClient.booking.findUnique({
      where: {
        id,
        isDeleted: false,
      },
    });

    if (!existingBooking)
      throw new ApiError(httpStatus.NOT_FOUND, "Booking not found!");

    const payload: Partial<Booking> = { status };
    let eligibleStatuses: BookingStatus[] = [];

    if (existingBooking.status === BookingStatus.Delivered) {
      throw new ApiError(httpStatus.CONFLICT, "Booking already delivered!");
    }

    if (status === existingBooking.status) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Can not update same booking status"
      );
    }

    if (existingBooking.status === BookingStatus.Drafted) {
      eligibleStatuses = [BookingStatus.Created, BookingStatus.Cancelled];
    }

    if (existingBooking.status === BookingStatus.Created) {
      eligibleStatuses = [BookingStatus.Cancelled, BookingStatus.Confirmed];
    }

    if (existingBooking.status === BookingStatus.Cancelled) {
      eligibleStatuses = [BookingStatus.Reverted];
    }

    if (existingBooking.status === BookingStatus.Reverted) {
      eligibleStatuses = [BookingStatus.Drafted, BookingStatus.Created];
    }

    if (existingBooking.status === BookingStatus.Confirmed) {
      eligibleStatuses = [BookingStatus.Shipped];
    }

    if (existingBooking.status === BookingStatus.Shipped) {
      eligibleStatuses = [BookingStatus.Delivered];
    }

    if (!eligibleStatuses.includes(status)) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Status '${status}' is not eligible to update`
      );
    }

    if (
      status === BookingStatus.Confirmed &&
      existingBooking.paymentMethod !== PaymentMethod.COD &&
      existingBooking.paymentStatus !== PaymentStatus.Paid
    ) {
      throw new ApiError(
        httpStatus.CONFLICT,
        `Can not confirm booking! payment method: ${existingBooking.paymentMethod}, payment status: ${existingBooking.paymentStatus}`
      );
    }

    if (
      eligibleStatuses.includes(status) &&
      status === BookingStatus.Delivered &&
      existingBooking.paymentMethod === PaymentMethod.COD
    ) {
      const trxnId = makeId("TRXN", 8);
      const createdPayment = await trxClient.payment.create({
        data: {
          userId: existingBooking.userId,
          bookingId: existingBooking.id,
          paymentMethod: existingBooking.paymentMethod,
          totalAmount: existingBooking.totalCost,
          status: PaymentStatus.Paid,
          transactionId: trxnId,
          provider: "DExpress",
        },
      });

      payload.paymentStatus = createdPayment.status;
    }

    const updatedBooking = await trxClient.booking.update({
      where: {
        id,
        isDeleted: false,
      },
      data: payload,
    });

    await trxClient.bookingLog.create({
      data: {
        bookingId: updatedBooking.id,
        currentStatus: updatedBooking.status,
        updatedById: user.userId,
      },
    });

    return updatedBooking;
  });
};

const deleteBooking = async (
  id: string,
  user: IValidateUser
): Promise<Booking | null> => {
  const bookingExist = await prismaClient.booking.findUnique({
    where: {
      id,
      ...(user.role === Role.customer && { userId: user.userId }),
      isDeleted: false,
    },
  });

  if (!bookingExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not exists");

  if (user.role === Role.customer && user.userId !== bookingExist.userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");
  }

  const booking = await prismaClient.booking.update({
    where: {
      id,
      ...(user.role === Role.customer && { userId: user.userId }),
    },
    data: { isDeleted: true },
  });

  return booking;
};

export const BookingService = {
  insertBooking,
  findAllBookings,
  findOneBooking,
  updateBooking,
  findMyBookings,
  updateBookingStatus,
  deleteBooking,
};
