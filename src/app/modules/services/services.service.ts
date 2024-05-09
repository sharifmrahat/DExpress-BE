import { Prisma, Service } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../../errors/api-error";
import prismaClient from "../../../shared/prisma-client";
import { IServiceFilterOption } from "./services.interface";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";

const createService = async (payload: Service): Promise<Service> => {
  const serviceExist = await prismaClient.service.findUnique({
    where: {
      title: payload.title,
    },
  });

  if (serviceExist)
    throw new ApiError(
      httpStatus.CONFLICT,
      "Service already exist with same title!"
    );

  const createdService = await prismaClient.service.create({
    data: payload,
  });
  if (!createdService)
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      "Failed to create service!"
    );

  return createdService;
};

const findServices = async (
  filterOptions: IServiceFilterOption,
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
      OR: ["title", "description"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.ServiceWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const services = await prismaClient.service.findMany({
    where: whereCondition,
    include: {
      packages: true,
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

  const count = await prismaClient.service.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: services,
  };
};

const findOneService = async (id: string): Promise<Service | null> => {
  const serviceExist: Service | null = await prismaClient.service.findUnique({
    where: {
      id,
    },
    include: {
      packages: true,
    },
  });

  if (!serviceExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Service not exists");

  return serviceExist;
};

const updateService = async (
  id: string,
  data: Service
): Promise<Service | null> => {
  const serviceExist = await prismaClient.service.findUnique({
    where: {
      id,
    },
  });

  if (!serviceExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Service not exists");

  if (data.title) {
    const titleExist = await prismaClient.service.findFirst({
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
        "Service already exist with same title!"
      );
  }

  const service: Service = await prismaClient.service.update({
    where: {
      id,
    },
    data,
  });
  return service;
};

const deleteService = async (id: string): Promise<Service | null> => {
  const serviceExist = await prismaClient.service.findUnique({
    where: {
      id,
    },
  });

  if (!serviceExist)
    throw new ApiError(httpStatus.NOT_FOUND, "Service not exists");

  await prismaClient.service.delete({
    where: {
      id,
    },
  });

  return serviceExist;
};

export const ServiceService = {
  createService,
  findServices,
  findOneService,
  updateService,
  deleteService,
};
