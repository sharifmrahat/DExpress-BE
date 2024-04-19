import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { ServiceService } from "./services.service";

const createService = catchAsync(async (req, res) => {
  const data = req.body;

  const result = await ServiceService.createService(data);

  return responseData({ message: "Service created successfully", result }, res);
});

const findServices = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, ["search"]);
  const result = await ServiceService.findServices(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "services retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findOneService = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ServiceService.findOneService(id);
  return responseData({ message: "Service fetched successfully", result }, res);
});

const updateService = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ServiceService.updateService(id, data);

  return responseData({ message: "Service updated successfully", result }, res);
});

const deleteService = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await ServiceService.deleteService(id);

  return responseData({ message: "Service deleted successfully", result }, res);
});

export const ServiceController = {
  createService,
  findServices,
  findOneService,
  updateService,
  deleteService,
};
