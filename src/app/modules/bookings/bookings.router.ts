import { Role } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validate-request";
import { BookingController } from "./bookings.controller";
import { BookingValidation } from "./bookings.validation";

const router = express.Router();

router
  .route("/")
  .get(auth(Role.admin, Role.super_admin), BookingController.findBookings)
  .post(
    auth(Role.customer),
    validateRequest(BookingValidation.createBookingZodSchema),
    BookingController.insertBooking
  );

router
  .route("/create-quotation")
  .post(
    auth(Role.admin, Role.super_admin),
    validateRequest(BookingValidation.createQuotationZodSchema),
    BookingController.insertBooking
  );

router
  .route("/my-bookings")
  .get(auth(Role.customer), BookingController.findMyBookings);

router
  .route("/update-status/:id")
  .patch(
    auth(Role.admin, Role.super_admin),
    validateRequest(BookingValidation.updateBookingStatusZodSchema),
    BookingController.updateBookingStatus
  );

router
  .route("/:id")
  .get(
    auth(Role.super_admin, Role.admin, Role.customer),
    BookingController.findOneBooking
  )
  .patch(
    auth(Role.admin, Role.super_admin, Role.customer),
    validateRequest(BookingValidation.updateBookingZodSchema),
    BookingController.updateBooking
  )
  .delete(
    auth(Role.customer, Role.admin, Role.super_admin),
    BookingController.deleteBooking
  );

export const BookingRouter = router;
