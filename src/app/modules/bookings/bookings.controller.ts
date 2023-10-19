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

const updateBookingBooking = catchAsync(async (req, res) => {
  const booking = req.body;
  const { id } = req.params;
  const user = (req as any).user as IValidateUser;

  const result = await BookingService.updateBooking(id, booking, user);

  return responseData({ message: "Booking updated successfully", result }, res);
});

const findOneBooking = catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = (req as any).user as IValidateUser;

  const result = await BookingService.findOneBooking(id, user);
  return responseData({ message: "Booking fetched successfully", result }, res);
});

const findBookings = catchAsync(async (req, res) => {
  const query = req.query;
  const user = (req as any).user as IValidateUser;
  const paginationOptions = pick(query, [
    "page",
    "size",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "minPrice",
    "maxPrice",
    "status",
  ]);
  const result = await BookingService.findBookings(
    user,
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

const findMyBookings = catchAsync(async (req, res) => {
  const user = (req as any).user as IValidateUser;
  const result = await BookingService.findMyBookings(user);
  return responseData(
    {
      message: "Bookings retrieved successfully",
      result,
    },
    res
  );
});

const findBookingByLorry = catchAsync(async (req, res) => {
  const user = (req as any).user as IValidateUser;
  const lorryId = req.params.lorryId;
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "size",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "minTotal",
    "maxTotal",
    "minRating",
    "rating",
    "status",
  ]);
  filterOptions.lorryId = lorryId;
  const result = await BookingService.findBookings(
    user,
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Booking with associated Lorrys data fetched successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

export const BookingController = {
  insertBooking,
  findOneBooking,
  findBookings,
  updateBookingBooking,
  findBookingByLorry,
  findMyBookings,
};
