import {
  BookingStatus,
  BookingType,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";

export interface IUserFilterOption {
  search?: string;
  status?: BookingStatus;
  bookingType?: BookingType;
  userId?: string;
  serviceId?: string;
  packageId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  departureDate?: Date;
  deliveryDate?: Date;
  startDate?: Date;
  endDate?: Date;
}
