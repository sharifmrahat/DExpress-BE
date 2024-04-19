import { Package, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/api-error";
import prismaClient from "../../../shared/prisma-client";
import { IPackageFilterOption } from "./packages.interface";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";

const createPackage = async (payload: Package): Promise<Package> => {
  const serviceExist = await prismaClient.service.findFirst({
    where: {
      id: payload.serviceId,
    },
  });

  if (!serviceExist)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Service not exist, please enter a valid serviceId!"
    );

  const packageExist = await prismaClient.package.findUnique({
    where: {
      title: payload.title,
      serviceId: serviceExist.id,
    },
  });

  if (packageExist)
    throw new ApiError(
      httpStatus.CONFLICT,
      "Package already exist with same title & service!"
    );

  const createdPackage = await prismaClient.package.create({
    data: payload,
  });
  if (!createdPackage)
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      "Failed to create package!"
    );

  return createdPackage;
};

const findPackages = async (
  filterOptions: IPackageFilterOption,
  paginationOptions: IPaginationOption
) => {
  const { limit, page, skip, sortBy, sortOrder } =
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
      OR: ["title", "description"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.PackageWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const packages = await prismaClient.package.findMany({
    where: whereCondition,
    include: {
      service: true,
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

  const count = await prismaClient.package.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: packages,
  };
};

const findOnePackage = async (id: string): Promise<Package | null> => {
  const packageExist: Package | null = await prismaClient.package.findUnique({
    where: {
      id,
    },
    include: {
      service: true,
    },
  });

  if (!packageExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Package not exists");

  return packageExist;
};

const updatePackage = async (
  id: string,
  data: Package
): Promise<Package | null> => {
  const packageExist = await prismaClient.package.findUnique({
    where: {
      id,
    },
  });

  if (!packageExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Package not exists");

  if (data.title) {
    const titleExist = await prismaClient.package.findFirst({
      where: {
        title: data.title,
        NOT: {
          id,
        },
      },
    });

    if (titleExist)
      throw new ApiError(
        httpStatus.CONFLICT,
        "Package already exist with same title!"
      );
  }

  if (data.serviceId) {
    const serviceExist = await prismaClient.service.findFirst({
      where: {
        id: data.serviceId,
      },
    });

    if (!serviceExist)
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Service not exist, please enter a valid serviceId!"
      );
  }

  const updatedPackage: Package = await prismaClient.package.update({
    where: {
      id,
    },
    data,
  });
  return updatedPackage;
};

const deletePackage = async (id: string): Promise<Package | null> => {
  const packageExist = await prismaClient.package.findUnique({
    where: {
      id,
    },
  });

  if (!packageExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Package not exists");

  await prismaClient.package.delete({
    where: {
      id,
    },
  });

  return packageExist;
};

export const PackageService = {
  createPackage,
  findPackages,
  findOnePackage,
  updatePackage,
  deletePackage,
};
