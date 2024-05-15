import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { IValidateUser } from "../auth/auth.interface";
import { IUpdatePassword } from "./users.interface";
import { UserService } from "./users.service";

const insertUser = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await UserService.insertUser(user);

  return responseData({ message: "User created successfully", result }, res);
});

const findUsers = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, ["search", "role", "id"]);
  const result = await UserService.findUsers(filterOptions, paginationOptions);
  return responseData(
    {
      message: "Users retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findOneUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserService.findOneUser(id);
  return responseData({ message: "User fetched successfully", result }, res);
});

const userProfile = catchAsync(async (req, res) => {
  const user = (req as any).user as IValidateUser;
  const result = await UserService.findOneUser(user.userId);
  return responseData(
    { message: "User profile fetched successfully", result },
    res
  );
});

const updateUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await UserService.updateUser(id, data);

  return responseData({ message: "User updated successfully", result }, res);
});

const updateProfile = catchAsync(async (req, res) => {
  const data = req.body;
  const user = (req as any).user as IValidateUser;

  const result = await UserService.updateProfile(data, user);

  return responseData({ message: "User updated successfully", result }, res);
});

const updatePassword = catchAsync(async (req, res) => {
  const data = req.body as IUpdatePassword;
  const user = (req as any).user as IValidateUser;

  const result = await UserService.updatePassword(data, user);

  return responseData(
    { message: "Password updated successfully", result },
    res
  );
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserService.deleteUser(id);

  return responseData({ message: "User deleted successfully", result }, res);
});

export const UserController = {
  insertUser,
  findUsers,
  findOneUser,
  userProfile,
  updateUser,
  updateProfile,
  updatePassword,
  deleteUser,
};
