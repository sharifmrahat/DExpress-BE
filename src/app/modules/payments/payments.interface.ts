import { PaymentMethod, PaymentStatus } from "@prisma/client";

export interface IPaymentFilterOption {
  search?: string;
  userId?: string;
  bookingId?: string;
  paymentMethod?: PaymentMethod;
  status?: PaymentStatus;
  maxAmount?: number;
  minAmount?: number;
}
