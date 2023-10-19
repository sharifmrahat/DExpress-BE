import { Prisma, Lorry } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/api-error";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";
import prismaClient from "../../../shared/prisma-client";
import { IFilterOption } from "./lorries.interface";

const insertLorry = async (payload: Lorry): Promise<Lorry> => {
  const exist = await prismaClient.lorry.findFirst({
    where: {
      plateNumber: payload.plateNumber,
    },
  });

  if (exist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Lorry already exist with same plate number!"
    );
  }
  const createdLorry = await prismaClient.lorry.create({
    data: payload,
  });

  return createdLorry;
};

const updateLorry = async (
  id: string,
  payload: Lorry
): Promise<Lorry | null> => {
  const lorryExist = await prismaClient.lorry.findUnique({
    where: {
      id,
    },
  });

  if (payload.plateNumber) {
    const exist = await prismaClient.lorry.findMany({
      where: {
        id: { not: id },
      },
    });
    if (exist.length)
      throw new ApiError(
        httpStatus.CONFLICT,
        "Lorry already exist with same plate number!"
      );
  }

  if (!lorryExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Lorry does not exists");

  const lorry = await prismaClient.lorry.update({
    where: {
      id,
    },
    data: payload,
  });

  return lorry;
};

const deleteLorry = async (id: string): Promise<Lorry | null> => {
  const lorryExist = await prismaClient.lorry.findUnique({
    where: {
      id,
    },
  });

  if (!lorryExist) throw new ApiError(httpStatus.NOT_FOUND, "Lorry not exists");

  await prismaClient.lorry.delete({
    where: {
      id,
    },
  });

  return lorryExist;
};

const findOneLorry = async (id: string): Promise<Lorry | null> => {
  const lorryExist = await prismaClient.lorry.findUnique({
    where: {
      id,
    },
    include: {
      bookings: {
        include: {
          reviews: true,
        },
      },
      category: true,
    },
  });

  if (!lorryExist) throw new ApiError(httpStatus.NOT_FOUND, "Lorry not exists");

  return lorryExist;
};

const findLorries = async (
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
        if (field === "minPrice") {
          return {
            price: {
              gte: Number(value),
            },
          };
        }

        if (field === "maxPrice") {
          return {
            price: {
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
      OR: ["model", "type"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.LorryWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const lorries = await prismaClient.lorry.findMany({
    where: whereCondition,
    include: {
      bookings: {
        include: {
          reviews: true,
        },
      },
      category: true,
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

  const count = await prismaClient.lorry.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      size,
      total: count,
      totalPage: !isNaN(count / size) ? Math.ceil(count / size) : 0,
    },
    data: lorries,
  };
};

const findLorryByCategory = async (id: string): Promise<Lorry[]> => {
  const lorries = await prismaClient.lorry.findMany({
    where: {
      categoryId: id,
    },
  });

  return lorries;
};

export const LorryService = {
  insertLorry,
  updateLorry,
  deleteLorry,
  findOneLorry,
  findLorries,
  findLorryByCategory,
};
