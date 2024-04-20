import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { IValidateUser } from "../auth/auth.interface";
import { BookingService } from "./bookings.service";

const insertBooking = catchAsync(async (req, res) => {
  const booking = req.body;
  const user = (req as any).user as IValidateUser;
  const result = await BookingService.insertBooking({
    ...booking,
    userId: user.userId,
  });

  return responseData({ message: "Booking created successfully", result }, res);
});

const findBookings = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "status",
    "bookingType",
    "userId",
    "serviceId",
    "packageId",
    "paymentMethod",
    "paymentStatus",
    "deliveryDate",
    "minTotal",
    "maxTotal",
    "createdDateRange",
  ]);
  const result = await BookingService.findAllBookings(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Bookings retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findOneBooking = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = (req as any).user as IValidateUser;

  const result = await BookingService.findOneBooking(id, user);
  return responseData({ message: "Booking fetched successfully", result }, res);
});

const findMyBookings = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "status",
    "bookingType",
    "serviceId",
    "packageId",
    "paymentMethod",
    "paymentStatus",
    "deliveryDate",
    "minTotal",
    "maxTotal",
    "createdDateRange",
  ]);

  const user = (req as any).user as IValidateUser;
  const result = await BookingService.findMyBookings(
    filterOptions,
    paginationOptions,
    user
  );
  return responseData(
    {
      message: "Bookings retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const updateBooking = catchAsync(async (req, res) => {
  const booking = req.body;
  const { id } = req.params;
  const user = (req as any).user as IValidateUser;

  const result = await BookingService.updateBooking(id, booking, user);

  return responseData({ message: "Booking updated successfully", result }, res);
});

const updateBookingStatus = catchAsync(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const user = (req as any).user as IValidateUser;

  const result = await BookingService.updateBookingStatus(id, status, user);

  return responseData(
    { message: "Booking status updated successfully", result },
    res
  );
});

const deleteBooking = catchAsync(async (req, res) => {
  const id = req.params?.id;
  const user = (req as any).user as IValidateUser;

  const result = await BookingService.deleteBooking(id, user);

  return responseData({ message: "Booking deleted successfully", result }, res);
});

export const BookingController = {
  insertBooking,
  findOneBooking,
  findBookings,
  findMyBookings,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
};
