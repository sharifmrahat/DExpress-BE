import bcrypt from "bcrypt";
import { Prisma, Role, User } from "@prisma/client";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import prismaClient from "../../../shared/prisma-client";
import { IValidateUser } from "../auth/auth.interface";
import { IUpdatePassword, IUserFilterOption } from "./users.interface";
import paginationHelpers, {
  IPaginationOption,
} from "../../../helpers/pagination-helpers";

const insertUser = async (payload: User): Promise<User> => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExist)
    throw new ApiError(
      httpStatus.CONFLICT,
      "User already exist with same email!"
    );

  const password = payload.password;

  payload.password = await bcrypt.hash(password!, config.BCRYPT_SALT_ROUNDS);

  const createdUser = await prismaClient.user.create({
    data: payload,
  });
  if (!createdUser)
    throw new ApiError(httpStatus.EXPECTATION_FAILED, "Failed to create user!");

  return createdUser;
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
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const count = await prismaClient.user.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total: count,
      totalPage: !isNaN(count / limit) ? Math.ceil(count / limit) : 0,
    },
    data: users,
  };
};

const updateUser = async (
  id: string,
  payload: User,
  validateUser: IValidateUser
): Promise<Omit<User, "password"> | null> => {
  if (validateUser.role === Role.customer && id !== validateUser.userId)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized access");

  const userExist = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not exists");

  //Only super_admin can update role
  if (
    (validateUser.role === Role.customer || validateUser.role === Role.admin) &&
    payload.role &&
    userExist.role !== payload.role
  )
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized to update user role"
    );

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

const updatePassword = async (
  payload: IUpdatePassword,
  validateUser: IValidateUser
): Promise<Omit<User, "password"> | null> => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      id: validateUser.userId,
    },
  });

  if (!userExist) throw new ApiError(httpStatus.NOT_FOUND, "User not exists");

  const oldPassword = payload.password;
  const newPassword = payload.newPassword;

  if (!userExist.password) {
    payload.newPassword = await bcrypt.hash(
      newPassword!,
      config.BCRYPT_SALT_ROUNDS
    );
    const user: Partial<User> = await prismaClient.user.update({
      where: {
        id: userExist.id,
      },
      data: { password: payload.newPassword },
    });
    delete user.password;
    return user as Omit<User, "password">;
  } else {
    const matchPassword = await bcrypt.compare(
      oldPassword!,
      userExist?.password
    );
    if (!matchPassword) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Password not matched!");
    } else {
      payload.newPassword = await bcrypt.hash(
        newPassword!,
        config.BCRYPT_SALT_ROUNDS
      );
      const user: Partial<User> = await prismaClient.user.update({
        where: {
          id: userExist.id,
        },
        data: { password: payload.newPassword },
      });
      delete user.password;
      return user as Omit<User, "password">;
    }
  }
};

export const UserService = {
  insertUser,
  updateUser,
  deleteUser,
  findOneUser,
  findUsers,
  updatePassword,
};
