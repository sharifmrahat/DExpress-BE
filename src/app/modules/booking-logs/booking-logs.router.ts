import express from "express";
import { BookingLogController } from "./booking-logs.controller";
import { Role } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route("/")
  .get(auth(Role.admin), BookingLogController.findAllBookingLogs);
export const BookingLogRouter = router;
