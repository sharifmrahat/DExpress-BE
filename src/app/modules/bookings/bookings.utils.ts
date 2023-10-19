import httpStatus from "http-status";
import ApiError from "../../../errors/api-error";
import prismaClient from "../../../shared/prisma-client";
import { LorryStatus } from "@prisma/client";

export const calculateTotal = async (
  startDate: Date,
  endDate: Date,
  lorryId: string
) => {
  const lorry = await prismaClient.lorry.findUnique({
    where: {
      id: lorryId,
      status: LorryStatus.Available,
    },
  });
  if (!lorry) throw new ApiError(httpStatus.NOT_FOUND, "Lorry Does not found!");

  const startOfTheDate = new Date(new Date(startDate).setHours(0, 0, 0, 0));
  const endOfTheDate = new Date(new Date(endDate).setHours(0, 0, 0, 0));

  const timeDifference = endOfTheDate.getTime() - startOfTheDate.getTime();
  if (timeDifference < 0)
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Date selection!");
  var daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  const total = lorry.price * daysDifference;
  return total;
};

export const BookingUtils = {
  calculateTotal,
};
