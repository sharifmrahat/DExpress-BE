import { Role, User } from "@prisma/client";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/api-error";
import prismaClient from "../../../shared/prisma-client";
import { IValidateUser } from "../auth/auth.interface";

const insertUser = async (payload: User): Promise<User> => {
  if (!payload.password) payload.password = config.DEFAULT_PASSWORD as string;
  payload.role = Role.admin;
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

const findUsers = async (): Promise<Partial<User>[]> => {
  const users = await prismaClient.user.findMany({});
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
