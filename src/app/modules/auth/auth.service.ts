import { User } from "@prisma/client";
import prismaClient from "../../../shared/prisma-client";
import bcrypt from "bcrypt";
import config from "../../../config";
import httpStatus from "http-status";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import ApiError from "../../../errors/api-error";

const login = async (payload: { email: string; password: string }) => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userExist)
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist!");

  if (
    userExist?.password &&
    !(await bcrypt.compare(payload.password, userExist?.password))
  )
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Email or Password not matched!"
    );

  const accessToken = JwtHelpers.generateToken({
    userId: userExist?.id,
    name: userExist.name,
    email: userExist.email,
    role: userExist?.role,
  });

  return accessToken;
};

const signup = async (payload: User) => {
  const password = payload.password;

  payload.password = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  const createdUser = await prismaClient.user.create({
    data: payload,
  });

  if (!createdUser)
    throw new ApiError(httpStatus.EXPECTATION_FAILED, "Failed to create user");

  const user: Partial<User | null> = await prismaClient.user.findFirst({
    where: {
      id: createdUser.id,
    },
  });

  const accessToken = JwtHelpers.generateToken({
    userId: user?.id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
  });

  return accessToken;
};

const socialAuth = async (payload: User) => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userExist) {
    const createdUser = await prismaClient.user.create({
      data: payload,
    });

    if (!createdUser)
      throw new ApiError(
        httpStatus.EXPECTATION_FAILED,
        "Failed to create user"
      );

    const user: Partial<User | null> = await prismaClient.user.findFirst({
      where: {
        id: createdUser.id,
      },
    });

    const accessToken = JwtHelpers.generateToken({
      userId: user?.id,
      name: user?.name,
      email: user?.email,
      role: user?.role,
    });

    return accessToken;
  } else {
    const accessToken = JwtHelpers.generateToken({
      userId: userExist?.id,
      name: userExist.name,
      email: userExist.email,
      role: userExist?.role,
    });

    return accessToken;
  }
};

export const AuthService = {
  signup,
  login,
  socialAuth,
};
