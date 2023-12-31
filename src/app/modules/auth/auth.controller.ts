import catchAsync from "../../../shared/catch-async";
import responseData from "../../../shared/response";
import { AuthService } from "./auth.service";

const signup = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const result = await AuthService.signup(userInfo);
  return responseData(
    {
      result,
      message: `User signup successfully!`,
    },
    res
  );
});

const login = catchAsync(async (req, res) => {
  const userCredential = req.body;
  const result = await AuthService.login(userCredential);

  return responseData(
    {
      message: "User login successfully!",
      accessToken: result,
    },
    res
  );
});

export const AuthController = {
  signup,
  login,
};
