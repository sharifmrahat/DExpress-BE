import { Role } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validate-request";
import { BookingController } from "./bookings.controller";
import { BookingValidation } from "./bookings.validation";

const router = express.Router();

router
  .route("/create-booking")
  .post(
    validateRequest(BookingValidation.createBookingZodSchema),
    auth(Role.customer),
    BookingController.insertBooking
  );

router
  .route("/")
  .get(
    auth(Role.super_admin, Role.admin, Role.customer),
    BookingController.findBookings
  );

router
  .route("/:lorryId/lorry")
  .get(
    auth(Role.super_admin, Role.admin),
    BookingController.findBookingByLorry
  );

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

export const BookingRouter = router;
