import catchAsync from "../../../shared/catch-async";
import pick from "../../../shared/pick";
import responseData from "../../../shared/response";
import { PackageService } from "./packages.service";

const createPackage = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await PackageService.createPackage(data);
  return responseData({ message: "Package created successfully", result }, res);
});

const findPackages = catchAsync(async (req, res) => {
  const query = req.query;
  const paginationOptions = pick(query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filterOptions = pick(query, [
    "search",
    "serviceId",
    "minPrice",
    "maxPrice",
  ]);
  const result = await PackageService.findPackages(
    filterOptions,
    paginationOptions
  );
  return responseData(
    {
      message: "Packages retrieved successfully",
      result: { result: result.data, meta: result.meta },
    },
    res
  );
});

const findOnePackage = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await PackageService.findOnePackage(id);
  return responseData({ message: "Package fetched successfully", result }, res);
});

const updatePackage = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await PackageService.updatePackage(id, data);
  return responseData({ message: "Package updated successfully", result }, res);
});

const deletePackage = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await PackageService.deletePackage(id);
  return responseData({ message: "Package deleted successfully", result }, res);
});

export const PackageController = {
  createPackage,
  findPackages,
  findOnePackage,
  updatePackage,
  deletePackage,
};
