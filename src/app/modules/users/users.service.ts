import { Prisma, Role, User } from "@prisma/client";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import prismaClient from "../../../shared/prisma-client";
import { IValidateUser } from "../auth/auth.interface";
import { IUserFilterOption } from "./users.interface";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";

const insertUser = async (payload: User): Promise<User> => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExist) throw new ApiError(httpStatus.CONFLICT, "User already exist!");

  const createdUser = await prismaClient.user.create({
    data: payload,
  });
  if (!createdUser)
    throw new ApiError(
      httpStatus.EXPECTATION_FAILED,
      "Failed to create admin!"
    );

  return createdUser;
};

const updateUser = async (
  id: string,
  payload: User,
  validateUser: IValidateUser
): Promise<Omit<User, "password"> | null> => {
  console.log(id, payload, validateUser);
  if (validateUser.role === Role.customer && id !== validateUser.userId)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

  const userExist = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not exists");

  if (
    (validateUser.role === Role.customer || validateUser.role === Role.admin) &&
    payload.role &&
    userExist.role !== payload.role
  )
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

  const user: Partial<User> = await prismaClient.user.update({
    where: {
      id,
    },
    data: payload,
  });
  delete user.password;
  return user as Omit<User, "password">;
};

const deleteUser = async (id: string): Promise<Partial<User> | null> => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not exists");

  await prismaClient.user.delete({
    where: {
      id,
    },
  });

  const { password, ...user } = userExist;

  return user;
};

const findOneUser = async (
  id: string
): Promise<Omit<User, "password"> | null> => {
  const userExist: Partial<User> | null = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not exists");

  delete userExist.password;
  return userExist as Omit<User, "password">;
};

const findUsers = async (
  filterOptions: IUserFilterOption,
  paginationOptions: IPaginationOption
): Promise<Partial<User>[]> => {
  const { size, page, skip, sortBy, sortOrder } =
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
      OR: ["name", "email", "contactNo"].map((field) => ({
        [field]: {
          contains: search,
          mode: "insensitive",
        },
      })),
    });

  const whereCondition: Prisma.UserWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const users = await prismaClient.user.findMany({
    where: whereCondition,
    skip,
    take: size,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });
  return users?.map((i) => {
    const { password, ...user } = i;
    return user;
  });
};

export const UserService = {
  insertUser,
  updateUser,
  deleteUser,
  findOneUser,
  findUsers,
};
