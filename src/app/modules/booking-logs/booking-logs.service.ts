import prismaClient from "../../../shared/prisma-client";
import { Prisma } from "@prisma/client";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";
import { IBookingLogFilterOption } from "./booking-logs.interface";

const findAllBookingLogs = async (
  filterOptions: IBookingLogFilterOption,
  paginationOptions: IPaginationOption
) => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers(paginationOptions);

  const andCondition = [];

  if (Object.keys(filterOptions).length) {
    andCondition.push({
      AND: Object.entries(filterOptions).map(([field, value]) => {
        return {
          [field]: value,
        };
      }),
    });
  }

  const whereCondition: Prisma.BookingLogWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const bookingLogs = await prismaClient.bookingLog.findMany({
    where: whereCondition,
    include: {
      booking: {
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
      },
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
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });

  const count = await prismaClient.bookingLog.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: bookingLogs,
  };
};

export const BookingLogService = {
  findAllBookingLogs,
};
