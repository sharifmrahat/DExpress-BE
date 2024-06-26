import { User } from "@prisma/client";
import prismaClient from "../../../shared/prisma-client";
import bcrypt from "bcrypt";
import config from "../../../config";
import httpStatus from "http-status";
import { JwtHelpers } from "../../../helpers/jwt-helpers";
import ApiError from "../../../errors/api-error";
import { makeId } from "../../../utils/makeUid";
import { sendEmail } from "../../../utils/sendEmail";
import { generateOtp } from "../../../utils/generateOtp";
import { IValidateUser } from "./auth.interface";

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
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (userExist) throw new ApiError(httpStatus.CONFLICT, "User already exist!");
  const password = payload.password;

  payload.password = await bcrypt.hash(password!, config.BCRYPT_SALT_ROUNDS);

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

  if (user) {
    const otp = generateOtp(6);

    await prismaClient.user.update({
      where: {
        id: user?.id,
      },
      data: {
        currentOtp: otp,
      },
    });

    const emailData = {
      to: payload.email,
      subject: "Welcome to DExpress",
      text: "Please use this secret code to verify your email.",
      html: `<p>OTP: <b>${otp}</b></p>`,
    };

    await sendEmail(emailData);
  }

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

const verifyEmail = async (currentOtp: string, user: IValidateUser) => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  if (!userExist.currentOtp) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OTP not found! first send OTP & verify again!"
    );
  }

  if (currentOtp !== userExist.currentOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Wrong OTP, try send again!");
  }

  const verifiedUser = await prismaClient.user.update({
    where: {
      id: userExist.id,
    },
    data: {
      isVerified: true,
      currentOtp: null,
    },
  });

  const { password, currentOtp: otp, ...rest } = verifiedUser;

  return rest;
};

const sendOTP = async (user: IValidateUser) => {
  const userExist = await prismaClient.user.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!userExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const otp = generateOtp(6);

  const updatedUser = await prismaClient.user.update({
    where: {
      id: userExist.id,
    },
    data: {
      currentOtp: otp,
    },
  });

  const emailData = {
    to: userExist.email,
    subject: "DExpress Verification",
    text: "Please use this secret code to verify your email.",
    html: `<p>OTP: <b>${otp}</b></p>`,
  };

  await sendEmail(emailData);
  const { currentOtp, password, ...rest } = updatedUser;
  return rest;
};

export const AuthService = {
  signup,
  login,
  socialAuth,
  verifyEmail,
  sendOTP,
};
