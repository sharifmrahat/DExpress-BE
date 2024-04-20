import { Role } from "@prisma/client";

export interface IUserFilterOption {
  search?: string;
  role?: Role;
}

export interface IUpdatePassword {
  password?: string;
  newPassword: string;
}
