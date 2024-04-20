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
    validateRequest(BookingValidation.createBookingZodSchema),
    auth(Role.customer),
    BookingController.insertBooking
  );

router
  .route("/my-bookings")
  .get(auth(Role.customer), BookingController.findMyBookings);

router
  .route("/:id")
  .get(
    auth(Role.super_admin, Role.admin, Role.customer),
    BookingController.findOneBooking
  )
  .patch(
    validateRequest(BookingValidation.updateBookingZodSchema),
    auth(Role.admin, Role.super_admin, Role.customer),
    BookingController.updateBookingBooking
  );

//Update status

export const BookingRouter = router;
