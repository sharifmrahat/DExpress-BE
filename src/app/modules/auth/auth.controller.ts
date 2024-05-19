import catchAsync from "../../../shared/catch-async";
import responseData from "../../../shared/response";
import { IValidateUser } from "./auth.interface";
import { AuthService } from "./auth.service";

const signup = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const accessToken = await AuthService.signup(userInfo);
  return responseData(
    {
      message: `User signup successfully!`,
      accessToken,
    },
    res
  );
});

const login = catchAsync(async (req, res) => {
  const userCredential = req.body;
  const accessToken = await AuthService.login(userCredential);

  return responseData(
    {
      message: "User login successfully!",
      accessToken,
    },
    res
  );
});

const socialAuth = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const accessToken = await AuthService.socialAuth(userInfo);
  return responseData(
    {
      message: `User login successfully!`,
      accessToken,
    },
    res
  );
});

const verifyEmail = catchAsync(async (req, res) => {
  const { currentOtp } = req?.body;
  const user = (req as any).user as IValidateUser;
  const result = await AuthService.verifyEmail(currentOtp, user);
  return responseData(
    {
      message: `User successfully verified!`,
      result,
    },
    res
  );
});

const sendOTP = catchAsync(async (req, res) => {
  const user = (req as any).user as IValidateUser;
  const result = await AuthService.sendOTP(user);
  return responseData(
    {
      message: `OTP has been sent to ${user?.email}`,
      result,
    },
    res
  );
});

export const AuthController = {
  signup,
  login,
  socialAuth,
  verifyEmail,
  sendOTP,
};
