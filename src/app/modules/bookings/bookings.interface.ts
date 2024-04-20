import {
  BookingStatus,
  BookingType,
  PaymentMethod,
  PaymentStatus,
} from "@prisma/client";

export interface IBookingFilterOption {
  search?: string;
  status?: BookingStatus;
  bookingType?: BookingType;
  userId?: string;
  serviceId?: string;
  packageId?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  deliveryDate?: Date;
  minTotal?: number;
  maxTotal?: number;
  createdDateRange?: Date[];
}
