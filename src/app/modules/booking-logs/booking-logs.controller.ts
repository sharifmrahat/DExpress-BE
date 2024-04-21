import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { BookingLogService } from "./booking-logs.service";

const findAllBookingLogs = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, ["currentStatus", "userId"]);

  const result = await BookingLogService.findAllBookingLogs(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Booking Logs retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

export const BookingLogController = {
  findAllBookingLogs,
};
