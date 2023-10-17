import catchAsync from "../../../shared/catch-async";
import responseData from "../../../shared/response";
import { IValidateUser } from "../auth/auth.interface";
import { UserService } from "./users.service";

const insertUser = catchAsync(async (req, res) => {
  const user = req.body;

  const result = await UserService.insertUser(user);

  return responseData({ message: "User inserted  successfully", result }, res);
});

const updateUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const user = (req as any).user as IValidateUser;

  const result = await UserService.updateUser(id, data, user);

  return responseData({ message: "User updated  successfully", result }, res);
});

const deleteUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserService.deleteUser(id);

  return responseData({ message: "User deleted  successfully", result }, res);
});

const userProfile = catchAsync(async (req, res) => {
  const user = (req as any).user as IValidateUser;

  const result = await UserService.findOneUser(user.userId);
  return responseData(
    { message: "User profile fetched successfully", result },
    res
  );
});

const findOneUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserService.findOneUser(id);
  return responseData({ message: "User fetched successfully", result }, res);
});

const findUsers = catchAsync(async (req, res) => {
  const result = await UserService.findUsers();
  return responseData({ message: "Users retrieved successfully", result }, res);
});

export const UserController = {
  insertUser,
  updateUser,
  deleteUser,
  userProfile,
  findOneUser,
  findUsers,
};
