import catchAsync from "../../../shared/catch-async";
import responseData from "../../../shared/response";
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

export const AuthController = {
  signup,
  login,
  socialAuth,
};
