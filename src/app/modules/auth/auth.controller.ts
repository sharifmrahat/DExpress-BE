import catchAsync from "../../../shared/catch-async";
import responseData from "../../../shared/response";
import { AuthService } from "./auth.service";

const signup = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await AuthService.signup(user);

  return responseData(
    {
      result,
      message: "User registered successfully!",
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
