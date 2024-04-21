import { BookingStatus } from "@prisma/client";

export interface IBookingLogFilterOption {
  currentStatus?: BookingStatus;
  updatedById?: string;
}
